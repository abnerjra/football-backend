import messages from "./messages/messages";
// src/domain/messages/custom.message.ts
type MessageContent = {
    message: string;
    severity: 'success' | 'warning' | 'error';
    code: number;
};

export class CustomMessage {
    static get(path: string): MessageContent {
        const keys = path.split('.');
        let current: any = messages;

        for (const key of keys) {
            if (current[key] === undefined) throw new Error(`Message path '${path}' not found`);
            current = current[key];
        }

        return current as MessageContent;
    }
}
