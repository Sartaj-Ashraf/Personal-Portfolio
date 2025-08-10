import ContactQueryModel from "../models/contactQueryModel.js";
import { getPaginationInfo, getPaginationParams } from "../utils/pagination.js";
import { StatusCodes } from "http-status-codes";

export const createContactQuery = async (req, res) => {
    const contactQuery = await ContactQueryModel.create(req.body);// body contains name, phone_number, message
    res.status(StatusCodes.CREATED).json({ success: true, message: "Contact query created successfully", contactQuery });
}

export const getContactQueries = async (req, res) => {
    const {
        search,
        status,
    } = req.query;
    
    const queryObject = {};

    if (search) {
        queryObject.$or = [
            { name: { $regex: search, $options: "i" } },
            { phone_number: { $regex: search, $options: "i" } },
        ];
    }

    if (status) {
        queryObject.status = status;
    }

    if (req.query.page || req.query.limit) {
        const { page, limit, skip } = getPaginationParams(req);
        const contactQueries = await ContactQueryModel
            .find(queryObject)
            .skip(skip)
            .limit(limit);

        const totalDocs = await ContactQueryModel.countDocuments(queryObject);
        const paginationInfo = getPaginationInfo(totalDocs, page, limit);
        return res.status(StatusCodes.OK).json({ success: true, message: "Contact queries fetched successfully", contactQueries, paginationInfo });
    }
    const contactQueries = await ContactQueryModel.find(queryObject);
    res.status(StatusCodes.OK).json({ success: true, message: "Contact queries fetched successfully", contactQueries });
}

export const updateContactQuery = async (req, res) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Contact query id is required" });
    }
    const contactQuery = await ContactQueryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(StatusCodes.OK).json({ success: true, message: "Contact query updated successfully", contactQuery });
}

export const deleteContactQuery = async (req, res) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Contact query id is required" });
    }
    const contactQuery = await ContactQueryModel.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Contact query deleted successfully", contactQuery });
}

export const deleteAllContactQueries = async (req, res) => {
    const contactQueries = await ContactQueryModel.deleteMany();
    res.status(StatusCodes.OK).json({ success: true, message: "All contact queries deleted successfully", contactQueries });
}
