import Project from "../models/projectModel.js";
import Techstack from "../models/techstackModel.js"; // Import Techstack model
import { StatusCodes } from "http-status-codes";
import { badRequestErr, NotFoundErr } from "../errors/customErors.js";
import { uploadImagesToCloudinary, deleteImagesFromCloudinary } from "../utils/imageHandler.js";
import { getPaginationInfo, getPaginationParams } from "../utils/pagination.js";

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const {
    title,
    techStack,
    features,
  } = req.body;

  let project = await Project.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });
  if (project) {
    throw new badRequestErr("Project already exists");
  }
  project = { ...req.body }


  // Parse techStack and features if they're strings (from form data)
  let parsedTechStack = techStack;
  let parsedFeatures = features;

  if (typeof techStack === 'string') {
    try {
      parsedTechStack = JSON.parse(techStack);
      project.techStack = parsedTechStack
    } catch (error) {
      throw new badRequestErr("Invalid techStack format");
    }
  }

  if (typeof features === 'string') {
    try {
      parsedFeatures = JSON.parse(features);
      project.features = parsedFeatures

    } catch (error) {
      throw new badRequestErr("Invalid features format");
    }
  }

  // Validate techStack ObjectIds if provided
  if (parsedTechStack && parsedTechStack.length > 0) {
    const validTechStacks = await Techstack.find({
      _id: { $in: parsedTechStack }
    }).select('_id');

    if (validTechStacks.length !== parsedTechStack.length) {
      throw new badRequestErr("One or more techStack IDs are invalid");
    }
  }

  // Handle image uploads
  let projectImages = [];
  if (req.files && req.files.length > 0) {
    projectImages = await uploadImagesToCloudinary(req.files);
    project.projectImages = projectImages
  }

  project = await Project.create(project)

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Project created successfully",
    project,
  });

};

// @desc    Get all projects with filtering, sorting, and pagination
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  const {
    category,
    status,
    techStack,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = req.query;

  // Build filter object
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  if (techStack) {
    filter.techStack = { $in: techStack.split(",") }; // Expecting comma-separated ObjectIds
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { features: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  if (req.query.page || req.query.limit) {
    const { page, limit, skip } = getPaginationParams(req);
    const projects = await Project.find(filter)
      .skip(skip)
      .limit(limit);
    const totalDocs = await Project.countDocuments(filter);
    const { paginationInfo } = getPaginationInfo(totalDocs, page, limit)
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Projects fetched successfully", projects, paginationInfo });

  }

  const projects = await Project.find(filter);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Project fetched successfully", projects });
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {

  const { id } = req.params;

  const project = await Project.findById(id).populate('techStack');

  if (!project) {
    throw new NotFoundErr("Project not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: project,
  });
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {

  const { id } = req.params;
  const {
    techStack,
    features,
  } = req.body;

  let project = await Project.findById(id);

  if (!project) {
    throw new NotFoundErr("Project not found");
  }

  project = { ...req.body };
  // Parse techStack and features if they're strings
  let parsedTechStack = techStack;
  let parsedFeatures = features;

  if (typeof techStack === 'string') {
    try {
      parsedTechStack = JSON.parse(techStack);
      project.techStack = parsedTechStack;
    } catch (error) {
      throw new badRequestErr("Invalid techStack format");
    }
  }

  if (typeof features === 'string') {
    try {
      parsedFeatures = JSON.parse(features);
      project.features = parsedFeatures;
    } catch (error) {
      throw new badRequestErr("Invalid features format");
    }
  }

  // Validate techStack ObjectIds if provided
  if (parsedTechStack && parsedTechStack.length > 0) {
    const validTechStacks = await Techstack.find({
      _id: { $in: parsedTechStack }
    }).select('_id');

    if (validTechStacks.length !== parsedTechStack.length) {
      throw new badRequestErr("One or more techStack IDs are invalid");
    }
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const newImages = await uploadImagesToCloudinary(req.files);
    project.projectImages.push(...newImages);
  }

  project = await Project.findByIdAndUpdate(id, project, { new: true })

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project updated successfully",
    project,
  });

};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    throw new NotFoundErr("Project not found");
  }

  // Delete all associated images from Cloudinary
  if (project.projectImages && project.projectImages.length > 0) {
    const publicIds = project.projectImages.map(img => img.publicId);
    await deleteImagesFromCloudinary(publicIds);
  }

  // Delete the project
  await Project.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project deleted successfully",
  });

};

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
export const getProjectsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, totalCount] = await Promise.all([
      Project.find({ category })
        .populate('techStack', 'name version icon')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Project.countDocuments({ category }),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(StatusCodes.OK).json({
      success: true,
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Public
export const getProjectStats = async (req, res) => {
  try {
    const [
      totalProjects,
      projectsByStatus,
      projectsByCategory,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Project.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Project.find()
        .populate('techStack', 'name version icon')
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title category status createdAt")
        .lean(),
    ]);

    // Get most used technologies
    const techStackStats = await Project.aggregate([
      { $unwind: "$techStack" },
      {
        $lookup: {
          from: "techstacks", // Collection name for Techstack model
          localField: "techStack",
          foreignField: "_id",
          as: "techInfo"
        }
      },
      { $unwind: "$techInfo" },
      { $group: { _id: "$techInfo.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        totalProjects,
        projectsByStatus,
        projectsByCategory,
        techStackStats,
        recentProjects,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
