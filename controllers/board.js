const Board = require('../models/board');
const mongoose = require('mongoose');
const { throwError } = require('../utils/helpers');

exports.getBoards = async (req, res, next) => {
    const userId = req.userId;
    try {
        const boards = await Board.find({ createdBy: userId });
        res.status(200).json({ message: "Success", boards });
    } catch (error) {
        next(error);
    }
};

exports.createNewBoard = async (req, res, next) => {
    const title = req.body.boardTitle;
    const userId = req.userId;

    try {
        if(!title) throwError("Please enter a title");

        const board = new Board({ title, createdBy: userId });
        const result = await board.save();
        res.status(200).json({ message: "Board created Succesfully", data: { id: result._id.toString(), title: result.title }});

    } catch (error) {
        next(error);
    }
};

exports.getBoardById = async (req, res, next) => {
    const boardId = req.params.boardId;

    try {
        if(!boardId) throwError("Please enter a correct board id");

        const data = await Board.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(boardId) },
            },
            {
                $lookup: {
                    from: "lists",
                    let: { boardId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$boardId", "$$boardId"] } }},
                        {
                            $lookup: {
                                from: "cards",
                                let: { listId: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$listId", "$$listId"] } }},

                                ],
                                as: "cards",
                            },
                        },
                    ],
                    as: "lists",
                },
            },
        ]);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};


exports.updateBoard = async (req, res, next) => {
    const title = req.body.title;
    const boardId = req.params.boardId;
    const userId = req.userId;

    try {
        if(!title) throwError("Please provide a title");

        const board = await Board.findOne({ _id: boardId, createdBy: userId });
        if(!board) throwError("No board found with that information");
        board.title = title;
        
        const result = await board.save();
        res.status(200).json({
            message: "Board edited successfully",
            data: { id: result._id.toString(), title: result.title },
        });
    } catch (error) {
        next(error);
    }
}


exports.deleteBoard = async (req, res, next) => {
    const boardId = req.params.boardId;
    const userId = req.userId;

    try {        
        const result = await Board.deleteOne({ _id: boardId, createdBy: userId });
        if(!result) throwError("No board found with that information");

        res.status(200).json({
            message: "Board deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}