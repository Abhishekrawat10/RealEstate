const { Listing } = require("../db");

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Error while Listing",
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    const findListing = await Listing.findById(req.params.id);
    if (!findListing) {
      res.status(401).json({
        msg: "Listing not found",
      });
    }
    if (req.user.id !== findListing.userRef) {
      res.status(400).json({
        msg: "You can only change ur listing",
      });
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      msg: "Listing Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Lising not found",
    });
  }
};

const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({
      msg: "Lisingt don't exist",
    });
  }
  if (req.user.id !== listing.userRef) {
    return res.status(401).json({
      msg: "You can only update you own listing...",
    });
  }

  try {
    const result = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Error while updating...",
    });
  }
};

const getListing = async (req, res) => {
  try {
    const findListing = await Listing.findById(req.params.id);
    if (!findListing) {
      res.status(400).json({ msg: "Listing Not Found" });
    }
    res.status(200).json(findListing);
  } catch (err) {
    res
      .status(400)
      .json({ msg: "Error while finding the listing in the databse" });
  }
};

const getListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
 
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Error while serching",
    });
  }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
