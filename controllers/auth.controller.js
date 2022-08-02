export const register = (req, res) => {
    console.log(req.body);
    res.json({ message: 'register' });
}

export const login = (req, res) => {
    res.json({ message: 'login' });
}
