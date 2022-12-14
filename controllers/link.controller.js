import { nanoid } from "nanoid";
import { Link } from "../models/Link.js";

export const getLinks = async (req, res) => {
    try {
        const links = await Link.find({ uid: req.uid });

        return res.json({ links });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: 'Error de servidor' });
    }
};

export const getLink = async (req, res) => {
    try {
        const { nanolink } = req.params;
        const link = await Link.findOne({ nanoLink: nanolink });
        console.log(link.longLink);

        if (!link) return res.status(404).json({ error: 'Link does not exist' });

        return res.json({ longLink: link.longLink });
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(403).json({ error: 'Incorrect id format' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
}

/* export const getLinkCRUD = async (req, res) => {
    try {
        const { id } = req.params
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: 'Link does not exist' });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: 'This link does not belong to you' });

        return res.json({ link });
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(403).json({ error: 'Incorrect id format' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
}; */

export const createLink = async (req, res) => {
    try {
        let { longLink } = req.body;
        if (!longLink.startsWith('https://')) {
            longLink = 'https://' + longLink;
        }

        const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
        const newLink = await link.save();

        return res.status(201).json({ newLink });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: 'Server error' });
    }
};

export const removeLink = async (req, res) => {
    try {
        const { id } = req.params
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: 'Link does not exist' });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: 'This link does not belong to you' });

        await link.remove();
        return res.json({ link });
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(403).json({ error: 'Incorrect id format' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
};

export const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        let { longLink } = req.body;

        console.log(longLink);

        if (!longLink.startsWith('https://')) {
            longLink = 'https://' + longLink;
        }

        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: 'Link does not exist' });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: 'This link does not belong to you' });

        // Actualizar
        link.longLink = longLink;
        await link.save();

        return res.json({ link });
    } catch (error) {
        console.log(error);
        if (error.kind === 'ObjectId') {
            return res.status(403).json({ error: 'Incorrect id format' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
};