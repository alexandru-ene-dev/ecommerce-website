export const profileController = (req, res) => {
    const { email } = req.body;
    let username;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email required'
        });
    }
    username = email.split('@')[0];
    return res.status(200).json({
        success: true,
        message: 'Hello' + username
    });
};
