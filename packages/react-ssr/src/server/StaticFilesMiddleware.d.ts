declare class StaticFileMiddleware {
    private staticDirs;
    constructor(staticDirs: string[]);
    private fileExists;
    private getContentType;
    handleRequest(req: Request): Promise<Response | null>;
}
export default StaticFileMiddleware;
