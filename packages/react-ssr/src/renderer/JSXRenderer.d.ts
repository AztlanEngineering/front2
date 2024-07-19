import React from 'react';
interface RendererOptions {
    defaultLocale?: string;
    loadMessages?: (locale: string) => Promise<any>;
    htmlString?: string;
}
export default class Renderer {
    private Component;
    private options;
    private locale;
    private messages;
    private extractor;
    constructor(Component: React.ComponentType<any>, options?: RendererOptions);
    prepareLocale(header: string | undefined): Promise<void>;
    render(req: Request): Promise<any>;
}
export {};
