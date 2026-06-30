import { Selection } from "../models/selection.model.js";
import { Student } from "../models/students.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendStudentApprovedEmail, sendRecruiterApprovalEmail } from "../services/email.service.js";

//get all selections
const getAllSelections = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'admin') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access" });
    }

    const selectionList = await Selection.aggregate([
        {
            $match: {}
        },
        {
            $sort: {
                updatedAt: 1
            }
        },
        {
            $lookup: {
                from: 'recruiters',
                localField: 'recruiter',
                foreignField: '_id',
                as: 'recruiter',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user',
                            pipeline: [
                                {
                                    $project: {
                                        email: 1,
                                        role: 1
                                    }
                                },

                            ]

                        }
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true
                        }
                    },

                ]
            }
        },
        {
            $unwind: {
                path: "$recruiter",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user',
                            pipeline: [
                                {
                                    $project: {
                                        email: 1,
                                        role: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true
                        }
                    },

                ]
            }
        },
        {
            $unwind: {
                path: "$student",
                preserveNullAndEmptyArrays: true
            }
        },

    ])

    res.status(200).json({ success: true, data: selectionList, message: "All selections fetched successfully!" })
})
// get filtered selections based on status
const getFilteredSelection = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'admin') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access" })
    }
    const { status } = req.query
    if (status !== 'pending' && status !== 'approved' && status !== 'rejected') {
        return res.status(400).json({ success: false, data: {}, message: "Invalid query" });
    }


    const selectionList = await Selection.aggregate([
        {
            $match: {
                status: status
            }
        },
        {
            $sort: {
                updatedAt: 1
            }
        },
        {
            $lookup: {
                from: 'recruiters',
                localField: 'recruiter',
                foreignField: '_id',
                as: 'recruiter',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user',
                            pipeline: [
                                {
                                    $project: {
                                        email: 1,
                                        role: 1
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$user",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                            ]

                        }
                    },

                ]
            }
        },
        {
            $unwind: {
                path: "$recruiter",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'students',
                localField: 'student',
                foreignField: '_id',
                as: 'student',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user',
                            foreignField: '_id',
                            as: 'user',
                            pipeline: [
                                {
                                    $project: {
                                        email: 1,
                                        role: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true
                        }
                    },

                ]
            }
        },
        {
            $unwind: {
                path: "$student",
                preserveNullAndEmptyArrays: true
            }
        },

    ])

    res.status(200).json({ success: true, data: selectionList, message: "Selections fetched successfully!" })
})
// update the status of a selection //approved/reject
const updateSelectionStatus = asyncHandler(async (req, res) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, data: {}, message: "Unauthorized access" });
    }
    const { selectionId } = req?.params
    const { status } = req.body
    if (!selectionId) {
        return res.status(400).json({ success: false, data: {}, message: "Invalid selection id" });
    }
    if (!status || !['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, data: {}, message: "Invalid status value" });
    }
    const selection = await Selection.findByIdAndUpdate(selectionId,
        {
            $set: {
                status
            }
        },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );
    if (!selection) {
        return res.status(404).json({
            success: false,
            data: {},
            message: "Selection not found"
        });
    }

    // Send email notifications when selection is approved
    if (status === 'approved') {
        try {
            const student = await Student.findById(selection.student).populate('user', 'email');
            const recruiter = await Recruiter.findById(selection.recruiter).populate('user', 'email');

            if (student && recruiter) {
                // Notify student about approval
                sendStudentApprovedEmail({
                    studentEmail: student.user.email,
                    studentName: student.fullName,
                    recruiterName: recruiter.fullName,
                    selectionRole: selection.selectionRole,
                    ctc: selection.ctc,
                });

                // Notify recruiter about approval
                sendRecruiterApprovalEmail({
                    recruiterEmail: recruiter.user.email,
                    recruiterName: recruiter.fullName,
                    studentName: student.fullName,
                    selectionRole: selection.selectionRole,
                    ctc: selection.ctc,
                });
            }
        } catch (emailError) {
            console.error('📧 Error preparing approval emails:', emailError.message);
        }
    }

    return res.status(200).json({ success: true, data: selection, message: "status updated successfully!" })

})

export { getAllSelections, getFilteredSelection, updateSelectionStatus }