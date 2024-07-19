import React from 'react';
/**
 * Parses an HTML string to extract and convert script and link tags to React.createElement calls.
 */
declare class Extractor {
    private document;
    constructor(html: string);
    private getElementsByTagName;
    private convertToReactElement;
    getLinkTags(): React.ReactElement[];
    getScriptTags(): React.ReactElement[];
}
export default Extractor;
