const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs').promises;
const Crud = require('./schema/crudSchema');
const Pic = require('./schema/fileSchema');
const jwt = require('jsonwebtoken');
const jwKey = 'abcd';

router.get('/find-data', async (req, res) => {
    try {
        const findData = await Crud.find({});
        return res.status(200).send(findData)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
});

router.post('/signup', async (req, res) => {
    try {
        const createData = await Crud.create({
            Username: req.body.username,
            Email: req.body.email,
            Password: req.body.password
        });
        res.status(200).send(createData);

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
});

function verify(req, res, next) {
    const getToken = req.headers['authentication'];

    if (getToken) {
        jwt.verify(getToken, jwKey, (error, valid) => {
            if (error) {
                res.status(500).send(error)
            } else {
                next()
            };
        });
    };
};

router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const login = await Crud.findOne({ Username: username, Email: email, Password: password });
        jwt.sign({ login }, jwKey, { expiresIn: "15min" }, (error, token) => {
            if (error) {
                res.status(500).send(error)
            } else {
                if (login) {
                    res.status(200).send({ login, token });
                } else {
                    res.status(404).send("not match data")
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
});

// Upload file api 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg"

    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/post-image', verify, upload.single("img"), async (req, res) => {
    try {
        if (req.file && req.file.path) {
            const postData = await Pic.create({
                PhotoPath: req.file.path,
                Title: req.body.title,
                Description: req.body.description,
                DropDown: req.body.dropdown,
            });
            res.status(200).send(postData)

        } else {
            res.send("image not upload")
        };
    } catch (error) {
        console.log(error);
        return res.send("img not found")
    };
});

router.get("/get-data", async (req, res) => {
    try {
        const getData = await Pic.find({});
        return res.status(200).send(getData)
    } catch (error) {
        console.log(error);
        res.send("not get message")
    }
});

router.get("/edit-data/:id", async (req, res) => {
    try {
        const editId = req.params.id;
        const editData = await Pic.findById(editId);
        if (!editData) {
            res.status(500).send("not edit image");
        }
        res.status(200).send(editData)
    } catch (error) {
        console.log(error, "not edit data");
        res.status(500).send("internet server error");
    }
});

router.put('/update-data/:id', upload.single("img"), async (req, res) => {
    try {
        const getId = req.params.id;
        const getData = await Pic.findById(getId);

        if (!getData) {
            res.status(500).send("not updateData")
        };

        if (req.file && req.file.path) {

            if (getData.PhotoPath) {
                await fs.unlink(getData.PhotoPath)
            };
            getData.PhotoPath = req.file.path;
            getData.Title = req.body.title;
            getData.Description = req.body.description;
            getData.DropDown = req.body.dropdown;
            const updateDate = await getData.save();
            res.status(200).send(updateDate)

        } else {
            res.status(400).send("image not update")
        };

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});

router.delete("/delete-data/:id", async (req, res) => {
    try {
        const getId = await Pic.findById(req.params.id);
        const getData = getId.PhotoPath

        await fs.access(getData);
        await fs.unlink(getData);
        const deleteData = await Pic.findByIdAndDelete(req.params.id);
        return res.status(200).send(deleteData)

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

module.exports = router;