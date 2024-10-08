const express = require('express');

const prisma = require('../prisma/client');

const { validationResult } = require('express-validator');

const bycrypt = require('bcryptjs');

const findUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        res.status(200).send({
            success: true,
            message: "Get all users successfully.",
            data: users,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: false,
            message: "Validation error.",
            errors: errors.array(),
        });
    }

    const hashedPassword = await bycrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            }
        });

        res.status(201).send({
            success: true,
            message: "User created successfully.",
            data: user,
        });
    } catch (error) {
        console.log(error);
        req.status(500).send({
            success: false,
            message: "Internal server error.",
        });
    }
}

const findUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        res.status(200).send({
            success: true,
            message: `Get user By ID: "${id}" and name: "${user.name}"`,
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error."
        })
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    const hashedPassword = await bycrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.update({
            where: { id: Number(id), },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            }
        });

        res.status(200).send({
            success: true,
            message: `User updated from ID: "${id}" and name: "${user.name}"`,
            data: user,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.delete({
            where: { id: Number(id), },
        });

        return res.status(200).send({
            success: true,
            message: `Deleted user from ID: "${id}`,
            data: user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error.",
        })
    }
}

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };