import * as signalR from '@microsoft/signalr';
import { apiConfig } from '../config/api.config';

type CharacterUpdatedCallback = (characterId: string) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private characterUpdatedCallbacks: Set<CharacterUpdatedCallback> = new Set();

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(apiConfig.signalRHubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0s, 2s, 10s, 30s
          if (retryContext.previousRetryCount === 0) return 0;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 10000;
          return 30000;
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.on('CharacterUpdated', (characterId: string) => {
      console.log('Character updated:', characterId);
      this.characterUpdatedCallbacks.forEach(callback => callback(characterId));
    });

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.connection.onclose((error) => {
      console.log('SignalR connection closed', error);
    });
  }

  async start(): Promise<void> {
    if (!this.connection) {
      throw new Error('SignalR connection not initialized');
    }

    const state = this.connection.state;
    
    // Don't try to start if already connected or connecting
    if (state === signalR.HubConnectionState.Connected || 
        state === signalR.HubConnectionState.Connecting) {
      console.log(`SignalR already in ${state} state, skipping start`);
      return;
    }

    try {
      await this.connection.start();
      console.log('SignalR connected successfully');
    } catch (err) {
      console.error('SignalR connection error:', err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      console.log('SignalR disconnected');
    } catch (err) {
      console.error('Error stopping SignalR connection:', err);
    }
  }

  onCharacterUpdated(callback: CharacterUpdatedCallback): () => void {
    this.characterUpdatedCallbacks.add(callback);
    return () => this.characterUpdatedCallbacks.delete(callback);
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();
