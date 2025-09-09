const logoutController = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(200).json({
            success: true,
            message: 'You have been logged out'
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${err}`
        });
    }
};
export { logoutController };
