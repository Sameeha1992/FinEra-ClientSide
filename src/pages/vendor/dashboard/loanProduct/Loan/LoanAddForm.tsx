
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";
import AddLoanForm from "@/components/loanProduct/AddLoanForm";

const LoanAddForm = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Section */}
            <div className="w-56 flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <AddLoanForm />
            </main>
        </div>
    );
};

export default LoanAddForm;
