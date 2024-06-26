const errorHandler = (err, req, res, next) => {
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'ValidationError':
            // mongoose validation error 
            return res.status(400).json({ message: err.message });
        case err.name === 'Unauthorized':
            // jwt authentication error
            return res.status(401).json({ message: 'Unauthorized' });
        case err.message.includes('getaddrinfo ENOTFOUND api.cloudinary.com'):
            // Handle the specific Cloudinary API host resolution error
            return res.status(500).json({ message: 'Error connecting to Cloudinary API' });
        default:
            return res.status(500).json({ message: err.message });
    }
}

export {errorHandler}


