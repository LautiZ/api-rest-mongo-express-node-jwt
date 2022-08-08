import { Link } from "../models/Link.js";

export const redirectLink = async (req, res) => {
    try {
        const { nanolink } = req.params;
        const link = await Link.findOne({ nanoLink: nanolink });

        if (!link) return res.status(404).json({ error: 'Link does not exist' });

        return res.redirect(link.longLink);
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(403).json({ error: 'Incorrect id format' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
}