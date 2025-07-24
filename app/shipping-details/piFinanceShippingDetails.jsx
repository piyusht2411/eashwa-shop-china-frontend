"use client";
import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";

// Constants
const API_CONFIG = {
  BASE_URL: "https://eashwa-china-backend.vercel.app/api",
  ENDPOINTS: {
    FINANCE_SHIPPING_DETAILS: "/formData/all-shipping-details",
  },
};

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrev: false,
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Custom hooks
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };
      const response = await fetch(url, {
        ...options,
        headers,
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Unauthorized: Please login again");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { makeRequest, loading, error };
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const formatCurrency = (amount, currency = "") => {
  if (!amount && amount !== 0) return "-";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return currency ? `${formatted} ${currency}` : formatted;
};

const truncateText = (text, maxLength = 30) => {
  if (!text) return "-";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    <span className="ml-3 text-orange-600 font-medium">
      Loading Finance & Shipping Details...
    </span>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-6 h-6 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      Error Loading Data
    </h3>
    <p className="text-red-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-xl border border-orange-200 p-12 text-center">
    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg
        className="w-8 h-8 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      No Finance & Shipping Details Found
    </h3>
    <p className="text-gray-600">
      There are no finance or shipping details to display at the moment.
    </p>
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-4 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider bg-gradient-to-r from-orange-50 to-orange-100">
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td
    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
  >
    {children}
  </td>
);

const AttachmentLink = ({ url, fileName }) => {
  if (!url) return <span className="text-gray-400 italic">No attachment</span>;

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "data.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <a
      onClick={handleDownloadPdf}
      className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium transition-colors cursor-pointer"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
      View PDF
    </a>
  );
};

const PaginationControls = ({
  pagination,
  currentPage,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const { totalPages, totalItems, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="bg-white px-6 py-4 border-t border-orange-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="font-medium">{totalItems}</span> results
        </span>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-orange-600 font-semibold"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className="px-3 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          First
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="px-3 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {generatePageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pageNum === currentPage
                  ? "bg-orange-500 text-white"
                  : "text-orange-600 bg-white border border-orange-300 hover:bg-orange-50"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="px-3 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="px-3 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Last
        </button>
      </div>
    </div>
  );
};

// Main Component
const PiFinanceShippingDetails = () => {
  const [details, setDetails] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState("");
  const router = useRouter();

  const { makeRequest, loading, error } = useApiCall();

  const fetchDetails = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedMonth) {
        params.append("month", selectedMonth);
      }

      const response = await makeRequest(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FINANCE_SHIPPING_DETAILS}?${params}`
      );

      setDetails(response.data || []);
      setPagination(response.pagination || DEFAULT_PAGINATION);
    } catch (err) {
      console.error("Failed to fetch finance & shipping details:", err);
    }
  }, [currentPage, itemsPerPage, selectedMonth, makeRequest]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        setCurrentPage(newPage);
      }
    },
    [pagination.totalPages]
  );

  const handleItemsPerPageChange = useCallback((newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  }, []);

  const handleMonthChange = useCallback((month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  }, []);

  const handleExportCSV = useCallback(() => {
    const csvData = details.map((detail, index) => ({
      "SR No.": (currentPage - 1) * itemsPerPage + index + 1,
      "PI Number": detail?.piNumber || "-",
      "Finance Date": formatDate(detail.financeDate),
      Currency: detail.financeRate || "-",
      Vendor: detail.shippingVendor || "-",
      Amount: formatCurrency(detail.amount, detail.financeRate),
      "Bill of Lading No.": detail.billOfLadingNo || "-",
      "Invoice No.": detail.invoiceNo || "-",
      "Vessel No.": detail.vesselNo || "-",
      "Container No.": detail.containerNo || "-",
      "Expected Time of Arrival": formatDate(detail.expectedTimeOfArrival),
      "Bill of Lading Attachment":
        detail.billOfLadingAttachment || "No attachment",
      "Invoice Attachment": detail.invoiceAttachment || "No attachment",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `finance-shipping-details-${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.click();
    URL.revokeObjectURL(url);
  }, [details, currentPage, itemsPerPage]);

  const handleRefresh = useCallback(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Finance & Shipping Details Dashboard
                </h1>
                <p className="text-orange-100 mt-1">
                  Freight and Arrival Management System
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-orange-600 font-semibold cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
                <button
                  className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  onClick={() => router.push("/pi-finance-shipping-form")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Details
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-8 py-6 border-b border-orange-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-black"
                >
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={details.length === 0 || loading}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 text-orange-600 font-semibold cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 overflow-hidden">
          {error ? (
            <div className="p-8">
              <ErrorMessage message={error} onRetry={handleRefresh} />
            </div>
          ) : loading ? (
            <LoadingSpinner />
          ) : details.length === 0 ? (
            <div className="p-8">
              <EmptyState />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <TableHeader>SR No.</TableHeader>
                      <TableHeader>PI Number</TableHeader>
                      <TableHeader>Finance Date</TableHeader>
                      <TableHeader>Currency</TableHeader>
                      <TableHeader>Vendor</TableHeader>
                      <TableHeader>Amount</TableHeader>
                      <TableHeader>Bill of Lading No.</TableHeader>
                      <TableHeader>Invoice No.</TableHeader>
                      <TableHeader>Vessel No.</TableHeader>
                      <TableHeader>Container No.</TableHeader>
                      <TableHeader>Expected Time of Arrival</TableHeader>
                      <TableHeader>Bill of Lading Attachment</TableHeader>
                      <TableHeader>Invoice Attachment</TableHeader>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {details.map((detail, index) => (
                      <tr
                        key={detail?.piNumber || index}
                        className="hover:bg-orange-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-orange-600">
                          {detail?.piNumber || "-"}
                        </TableCell>
                        <TableCell>{formatDate(detail.financeDate)}</TableCell>
                        <TableCell>{detail.financeRate || "-"}</TableCell>
                        <TableCell>
                          <span title={detail.shippingVendor}>
                            {truncateText(detail.shippingVendor)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(detail.amount, detail.financeRate)}
                        </TableCell>
                        <TableCell>{detail.billOfLadingNo || "-"}</TableCell>
                        <TableCell>{detail.invoiceNo || "-"}</TableCell>
                        <TableCell>{detail.vesselNo || "-"}</TableCell>
                        <TableCell>{detail.containerNo || "-"}</TableCell>
                        <TableCell>
                          {formatDate(detail.expectedTimeOfArrival)}
                        </TableCell>
                        <TableCell>
                          <AttachmentLink
                            url={detail.billOfLadingAttachment}
                            fileName="bill-of-lading.pdf"
                          />
                        </TableCell>
                        <TableCell>
                          <AttachmentLink
                            url={detail.invoiceAttachment}
                            fileName="invoice.pdf"
                          />
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <PaginationControls
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PiFinanceShippingDetails;
