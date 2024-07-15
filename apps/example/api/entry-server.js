const config = {
    runtime: 'edge',
    // execute this function on iad1 or hnd1, based on the connecting client location
    regions: [
        'iad1',
        'hnd1'
    ]
};
function handler(request, response) {
    return response.status(200).json({
        text: `I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`
    });
}

export { config, handler as default };
