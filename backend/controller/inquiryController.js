import {
  createInquiry,
  fetchInquiries,
  fetchInquiryById,
  approveInquiry,
  rejectInquiry,
} from "../service/inquiryService.js";

function determineStatusCode(error) {
  const message = error?.message?.toLowerCase() ?? "";

  if (message.includes("not found")) {
    return 404;
  }

  if (
    message.includes("required") ||
    message.includes("invalid") ||
    message.includes("only pending") ||
    message.includes("not available")
  ) {
    return 400;
  }

  return 500;
}

export async function submitInquiry(req, res) {
  try {
    const inquiry = await createInquiry(req.body);

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getInquiries(req, res) {
  try {
    const inquiries = await fetchInquiries();

    return res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getInquiryById(req, res) {
  try {
    const inquiry = await fetchInquiryById(req.params.id);

    return res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

export async function approveInquiryRequest(req, res) {
  try {
    const result = await approveInquiry({
      inquiryId: req.params.id,
      reviewedBy: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry approved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

export async function rejectInquiryRequest(req, res) {
  try {
    const result = await rejectInquiry({
      inquiryId: req.params.id,
      reviewedBy: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry rejected successfully",
      data: result,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

/*
|--------------------------------------------------------------------------
| Compatibility exports
|--------------------------------------------------------------------------
*/

export const createInquiryController = submitInquiry;

export const retrieveInquiries = getInquiries;

export const approveInquiryController = approveInquiryRequest;

export const rejectInquiryController = rejectInquiryRequest;
