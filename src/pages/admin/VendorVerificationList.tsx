import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/Adminlayout";
import Pagination from "@/components/ui/Pagination";
import { vendorVerificationList } from "@/api/admin/VendorVerification";
import { useDebounce } from "@/hooks/useDebounce";
import ClearSearchButton from "@/components/ui/ClearSearchButton";
import type { VendorVerification } from "@/interfaces/admin/VendorVerification";

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<
    "verified" | "not verified" | "rejected",
    { pill: string; dot: string; label: string }
> = {
    verified: {
        pill: "bg-green-100 text-green-800",
        dot: "bg-green-500",
        label: "Verified",
    },
    "not verified": {
        pill: "bg-yellow-100 text-yellow-800",
        dot: "bg-yellow-400",
        label: "Not Verified",
    },
    rejected: {
        pill: "bg-red-100 text-red-800",
        dot: "bg-red-500",
        label: "Rejected",
    },
};

const VerificationBadge = ({
    status,
}: {
    status: "verified" | "not verified" | "rejected";
}) => {
    const { pill, dot, label } = STATUS_STYLES[status] ?? STATUS_STYLES["not verified"];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`} />
            {label}
        </span>
    );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const VendorVerificationList = () => {
    const navigate = useNavigate();

    const [allVendors, setAllVendors] = useState<VendorVerification[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [loading, setLoading] = useState(false);

    const handleClearSearch = () => {
        setSearch("");
        setCurrentPage(1);
    };

    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const vendors = allVendors;

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await vendorVerificationList.getVendorList(
                    currentPage,
                    itemsPerPage,
                    debouncedSearch
                );
                setAllVendors(res.vendors);
                setTotalResults(res.total);
            } catch (err) {
                console.error("Failed to fetch vendor verifications", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentPage, debouncedSearch]);

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Title */}
                <h2 className="text-xl font-semibold mb-6">Pending Verifications</h2>

                <div className="overflow-x-auto">
                    {/* Search */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-64 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 pr-10"
                            />
                            <ClearSearchButton 
                                show={search.length > 0} 
                                onClick={handleClearSearch} 
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                    VendorId
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-10 text-center text-gray-400 text-sm"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-10 text-center text-gray-400 text-sm"
                                    >
                                        No vendor verifications found.
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr
                                        key={vendor.vendorId}
                                        className="border-b hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                            #{vendor.vendorId}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-800">
                                            {vendor.vendorName}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {vendor.email}
                                        </td>
                                        <td className="px-4 py-4">
                                            <VerificationBadge status={vendor.status} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/vendor-verification/${vendor.vendorId}`
                                                    )
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded transition-colors"
                                            >
                                                <Eye size={13} />
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer: count + pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        Showing {vendors.length} of {totalResults} results
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default VendorVerificationList;
