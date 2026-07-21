import {
  createInquiryRecord,
  getInquiryRecords,
  getInquiryRecordById,
  approveInquiryRecord,
  rejectInquiryRecord,
  updateInquiryRecord,
} from "../model/inquiryModel.js";

import { getRoomById } from "../model/roomModel.js";

import { validateInquiry } from "../validation/inquiryValidation.js";

export async function createInquiry(data) {
  validateInquiry(data);

  const normalizedData = {
    name: String(data.name).trim(),
    email: String(data.email).trim().toLowerCase(),
    contact: data.contact ? String(data.contact).trim() : null,
    roomId: data.roomId,
    type: String(data.type).trim(),
    moveInDate: data.moveInDate || null,
    message: String(data.message).trim(),
  };

  const room = await getRoomById(normalizedData.roomId);

  if (!room) {
    throw new Error("The selected room does not exist");
  }

  if (room.status !== "Available") {
    throw new Error("The selected room is not available");
  }

  return createInquiryRecord(normalizedData);
}

export async function fetchInquiries() {
  return getInquiryRecords();
}

export async function fetchInquiryById(inquiryId) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required");
  }

  const inquiry = await getInquiryRecordById(inquiryId);

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  return inquiry;
}

export async function approveInquiry({ inquiryId, reviewedBy }) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required");
  }

  if (!reviewedBy) {
    throw new Error("Administrator ID is required");
  }

  const inquiry = await getInquiryRecordById(inquiryId);

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  if (inquiry.status !== "Pending") {
    throw new Error("Only pending inquiries can be approved");
  }

  return approveInquiryRecord({
    inquiryId,
    reviewedBy,
  });
}

export async function rejectInquiry({ inquiryId, reviewedBy }) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required");
  }

  if (!reviewedBy) {
    throw new Error("Administrator ID is required");
  }

  const inquiry = await getInquiryRecordById(inquiryId);

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  if (inquiry.status !== "Pending") {
    throw new Error("Only pending inquiries can be rejected");
  }

  return rejectInquiryRecord({
    inquiryId,
    reviewedBy,
  });
}

export async function updateInquiry(inquiryId, updates) {
  if (!inquiryId) {
    throw new Error("Inquiry ID is required");
  }

  const inquiry = await getInquiryRecordById(inquiryId);

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  if (inquiry.status !== "Pending") {
    throw new Error("Only pending inquiries can be edited");
  }

  return updateInquiryRecord(inquiryId, updates);
}
