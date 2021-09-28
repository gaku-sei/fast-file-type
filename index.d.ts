export function fromFile(filepath: string): Promise<string>;

export function fromFileSync(filepath: string): string;

export function fromBuffer(buffer: Buffer): Promise<string>;

export function fromBufferSync(buffer: Buffer): string;

export function matchFile(filepath: string, mime: string): Promise<boolean>;

export function matchFileSync(filepath: string, mime: string): boolean;

export function matchBuffer(buffer: Buffer, mime: string): Promise<boolean>;

export function matchBufferSync(buffer: Buffer, mime: string): boolean;
