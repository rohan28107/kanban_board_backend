const Card = require('../models/card');
const List = require('../models/list');
const { throwError } = require('../utils/helpers');

exports.createNewList = async (req, res, next) => {
    const boardId = req.body.boardId;
    const title = req.body.title;

    try {
        if(!boardId || !title) throwError("Title or boardId is invalid");

        const list  = new List({ title, boardId });
        const result = await list.save();
        res.status.json({
            message: 'Success',
            data: { id: result._id.toString(), title: result.title },

        });
    } catch (error) {
        next(error);
    }
};

exports.updateList = async (req, res, next) => {
    const listId = req.body.listId;
    const title = req.body.title;

    try {
        if(!listId || !title) throwError("Title or listId is invalid");

        const list  = new List.findById(listId);
        list.title = title;
        const result = await list.save();
        res.status.json({
            message: 'Success',
            data: { id: result._id.toString(), title: result.title },
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteList = async (req, res, next) => {
    const listId = req.params.listId;

    try {
        if(!listId) throwError("ListId is invalid");

        await Card.deleteMany({ listId });
        await List.deleteOne({ _id: listId });
        res.status.json({
            message: 'List deleted Succesfully',
        });
    } catch (error) {
        next(error);
    }
};