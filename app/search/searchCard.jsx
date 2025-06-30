"use client";
import { useState, useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

// Constants
const API_CONFIG = {
  BASE_URL: "https://eashwa-china-backend.vercel.app/api",
  ENDPOINTS: {
    SEARCH_DETAILS: "/formData/search-details",
  },
};

const SEARCH_OPTIONS = [
  { value: "piNumber", label: "PI Number" },
  { value: "boeNo", label: "BOE Number" },
];

// Custom hooks
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    console.log("Starting fetch from:", url);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Fetch error:", err);
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

const formatDutyPaid = (dutyPaid) => {
  if (dutyPaid === undefined || dutyPaid === null) return "-";
  if (typeof dutyPaid === "string") {
    return dutyPaid.toLowerCase() === "true"
      ? "Yes"
      : dutyPaid.toLowerCase() === "false"
      ? "No"
      : "-";
  }
  return dutyPaid ? "Yes" : "No";
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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
      Searching Details...
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
      No Details Found
    </h3>
    <p className="text-gray-600">
      No details found for the provided search criteria.
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
      toast.error("Failed to download PDF");
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

// Main Component
const SearchCard = () => {
  const [searchType, setSearchType] = useState("piNumber");
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState({
    piDetails: [],
    shippingDetails: [],
    clearanceDetails: [],
    transportationDetails: [],
  });
  const [hasSearched, setHasSearched] = useState(false); // New state to track search
  const { makeRequest, loading, error } = useApiCall();

  useEffect(() => {
    console.log("Token:", localStorage.getItem("token"));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      toast.error(
        `Please enter a valid ${
          searchType === "piNumber" ? "PI Number" : "BOE Number"
        }`
      );
      return;
    }

    try {
      console.log("Search Type:", searchType, "Search Value:", searchValue);
      const params = new URLSearchParams({
        [searchType]: searchValue,
      });
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH_DETAILS}?${params}`;
      console.log("Fetching from URL:", url);
      const response = await makeRequest(url);
      const data = response.data || response;
      console.log("Parsed Data:", data);
      setSearchResults({
        piDetails: data.piDetails || [],
        shippingDetails: data.shippingDetails || [],
        clearanceDetails: data.clearanceDetails || [],
        transportationDetails: data.transportationDetails || [],
      });
      setHasSearched(true); // Set hasSearched to true after successful search
      toast.success("Search completed successfully!");
    } catch (err) {
      console.error("Search error:", err);
      setHasSearched(true); // Still show tables on error
      toast.error(err.message || "Failed to fetch search results");
    }
  };

  const handleRetry = () => {
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Details
                </h1>
                <p className="text-orange-100 mt-1">
                  Search by PI Number or BOE Number
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <button className="px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 flex items-center gap-2 cursor-pointer">
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <div className="px-8 py-6 border-b border-orange-200">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-black"
                >
                  {SEARCH_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={`Enter ${
                    searchType === "piNumber" ? "PI Number" : "BOE Number"
                  }`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-black"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600"
                }`}
              >
                Search
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-b-2xl overflow-hidden">
            {error ? (
              <div className="p-8">
                <ErrorMessage message={error} onRetry={handleRetry} />
              </div>
            ) : loading ? (
              <LoadingSpinner />
            ) : hasSearched ? (
              <div className="overflow-x-auto">
                {/* PI Details Table */}
                {searchType === "piNumber" && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-orange-600 mb-4">
                      PI Details
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-orange-200">
                          <TableHeader>SR No.</TableHeader>
                          <TableHeader>PI Number</TableHeader>
                          <TableHeader>Date</TableHeader>
                          <TableHeader>Vendor</TableHeader>
                          <TableHeader>Pieces</TableHeader>
                          <TableHeader>Model</TableHeader>
                          <TableHeader>Rate</TableHeader>
                          <TableHeader>Exchange Rate</TableHeader>
                          <TableHeader>Current Rate</TableHeader>
                          <TableHeader>Advance Amount</TableHeader>
                          <TableHeader>Serial Number</TableHeader>
                          <TableHeader>Attachment</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {searchResults.piDetails.length > 0 ? (
                          searchResults.piDetails.map((detail, index) => (
                            <tr
                              key={detail.piNumber || index}
                              className="hover:bg-orange-50 transition-colors"
                            >
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-medium text-orange-600">
                                {detail.piNumber || "-"}
                              </TableCell>
                              <TableCell>{formatDate(detail.date)}</TableCell>
                              <TableCell>
                                {truncateText(detail.detailVendor)}
                              </TableCell>
                              <TableCell>{detail.pieces || "-"}</TableCell>
                              <TableCell>{detail.model || "-"}</TableCell>
                              <TableCell>{detail.detailRate || "-"}</TableCell>
                              <TableCell>
                                {formatCurrency(detail.detailExchangeRate)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(detail.detailCurrentRate)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(detail.advanceAmount)}
                              </TableCell>
                              <TableCell>
                                {detail.runningSerialNumber || "-"}
                              </TableCell>
                              <TableCell>
                                <AttachmentLink
                                  url={detail.attachment}
                                  fileName="pi-attachment.pdf"
                                />
                              </TableCell>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={12}
                              className="px-6 py-8 text-center text-gray-600 font-medium"
                            >
                              No data available for this PI Number
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Shipping Details Table */}
                {searchType === "piNumber" && (
                  <div className="p-6 border-t border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-600 mb-4">
                      Shipping Details
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-orange-200">
                          <TableHeader>SR No.</TableHeader>
                          <TableHeader>PI Number</TableHeader>
                          <TableHeader>Date</TableHeader>
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
                        {searchResults.shippingDetails.length > 0 ? (
                          searchResults.shippingDetails.map((detail, index) => (
                            <tr
                              key={detail.piNumber || index}
                              className="hover:bg-orange-50 transition-colors"
                            >
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-medium text-orange-600">
                                {detail.piNumber || "-"}
                              </TableCell>
                              <TableCell>
                                {formatDate(detail.financeDate)}
                              </TableCell>
                              <TableCell>{detail.financeRate || "-"}</TableCell>
                              <TableCell>
                                {truncateText(detail.shippingVendor)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(
                                  detail.amount,
                                  detail.financeRate
                                )}
                              </TableCell>
                              <TableCell>
                                {detail.billOfLadingNo || "-"}
                              </TableCell>
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
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={13}
                              className="px-6 py-8 text-center text-gray-600 font-medium"
                            >
                              No data available for this PI Number
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Clearance Details Table */}
                {searchType === "boeNo" && (
                  <div className="p-6 border-t border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-600 mb-4">
                      BOE Details
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-orange-200">
                          <TableHeader>SR No.</TableHeader>
                          <TableHeader>PI Number</TableHeader>
                          <TableHeader>BOE No.</TableHeader>
                          <TableHeader>Duty Paid</TableHeader>
                          <TableHeader>Duty Amount</TableHeader>
                          <TableHeader>Rate</TableHeader>
                          <TableHeader>Date</TableHeader>
                          <TableHeader>Attachment</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {searchResults.clearanceDetails.length > 0 ? (
                          searchResults.clearanceDetails.map(
                            (detail, index) => (
                              <tr
                                key={detail.piNumber || index}
                                className="hover:bg-orange-50 transition-colors"
                              >
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-orange-600">
                                  {detail.piNumber || "-"}
                                </TableCell>
                                <TableCell>{detail.boeNo || "-"}</TableCell>
                                <TableCell>
                                  {formatDutyPaid(detail.dutyPaid)}
                                </TableCell>
                                <TableCell>{`$${
                                  detail.dutyAmout?.toFixed(2) || "-"
                                }`}</TableCell>
                                <TableCell>
                                  {detail.usdRateAtClearance || "-"}
                                </TableCell>
                                <TableCell>
                                  {formatDate(detail.clearanceDate)}
                                </TableCell>
                                <TableCell>
                                  <AttachmentLink
                                    url={detail.igmAttachment}
                                    fileName="igm-attachment.pdf"
                                  />
                                </TableCell>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={8}
                              className="px-6 py-8 text-center text-gray-600 font-medium"
                            >
                              No data available for this BOE Number
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Transportation Details Table */}
                {searchType === "boeNo" && (
                  <div className="p-6 border-t border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-600 mb-4">
                      Transportation Details
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-orange-200">
                          <TableHeader>SR No.</TableHeader>
                          <TableHeader>PI Number</TableHeader>
                          <TableHeader>E-Way Bill Number</TableHeader>
                          <TableHeader>Amount of Transport</TableHeader>
                          <TableHeader>Final Destination</TableHeader>
                          <TableHeader>BOE No.</TableHeader>
                          <TableHeader>Detail Rate</TableHeader>
                          <TableHeader>Model Name</TableHeader>
                          <TableHeader>Total Amount</TableHeader>
                          <TableHeader>E-Way Bill Attachment</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {searchResults.transportationDetails.length > 0 ? (
                          searchResults.transportationDetails.map(
                            (detail, index) => (
                              <tr
                                key={detail.piNumber || index}
                                className="hover:bg-orange-50 transition-colors"
                              >
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-orange-600">
                                  {detail.piNumber || "-"}
                                </TableCell>
                                <TableCell>
                                  {detail.eWayBillNumber || "-"}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(detail.amountOfTransport)}
                                </TableCell>
                                <TableCell>
                                  {truncateText(detail.finalDestination)}
                                </TableCell>
                                <TableCell>
                                  {truncateText(detail.boeNo)}
                                </TableCell>
                                <TableCell>
                                  {detail.detailRate || "-"}
                                </TableCell>
                                <TableCell>
                                  {truncateText(detail.modelName)}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(detail.totalAmout)}
                                </TableCell>
                                <TableCell>
                                  <AttachmentLink
                                    url={detail.attachedmentEWayBill}
                                    fileName="eway-bill.pdf"
                                  />
                                </TableCell>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={10}
                              className="px-6 py-8 text-center text-gray-600 font-medium"
                            >
                              No data available for this BOE Number
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
