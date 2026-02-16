import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { ILoanProductDto } from "@/interfaces/addLoan/loanProduct.dto";
import { loanProduct } from "@/api/loanProduct/loanProduct.service";
import { loanProductSchema } from "@/validations/loanProduct.validation";
import toast from "react-hot-toast";

export default function AddLoanForm() {
  const [formData, setFormData] = useState<ILoanProductDto>({
    name: "",
    description: "",
    status: "ACTIVE",
    amount: { minimum: 0, maximum: 0 },
    tenure: { minimum: 0, maximum: 0 },
    interestRate: 0,
    duePenalty: 0,
    features: [],
    eligibility: {
      minAge: 0,
      maxAge: 0,
      minSalary: 0,
      cibilScore: 0,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ILoanProductDto,
    nestedField?: string,
  ) => {
    const value = e.target.value;

    const fieldPath = nestedField ? `${field}.${nestedField}` : field;

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldPath as string];
      return updated;
    });

    if (nestedField) {
      // Only allow nested update for object fields
      setFormData((prev) => {
        const nested = prev[field] as Record<string, any>; // cast to object
        return {
          ...prev,
          [field]: {
            ...nested,
            [nestedField]: value === "" ? "" : Number(value),
          },
        };
      });
    } else {
      // Handle top-level fields
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "interestRate" || field === "duePenalty"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleSubmit = async () => {
    const result = loanProductSchema.safeParse(formData);

    console.log("nammude data",result)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      await loanProduct.addLoan(result.data);
      toast.success("Loan Product Created Successfully");
      setErrors({});
    } catch (error) {
      console.error("Error creating loan product", error);
      toast.error("Error creating loan product")
    }
  };

  const getError = (path: string) => errors[path];
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <Card className="w-full max-w-5xl shadow-xl rounded-2xl border-none">
        <CardHeader className="text-center pb-2">
          <h1 className="text-3xl font-bold text-gray-700">Add Loans</h1>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Basic Loan Information */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-black uppercase tracking-wide">
              BASIC LOAN INFORMATION:-
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="loanType1"
                  className="text-gray-600 font-semibold"
                >
                  Loan Type
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange(e, "name")}
                  className={`h-12 ${
                    getError("name") ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {getError("name") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("name")}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-gray-600 font-semibold"
                >
                  Loan Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange(e, "description")}
                  className={`h-12 ${
                    getError("description")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
                {getError("description") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("description")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loan Amount Details */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-black uppercase tracking-wide">
              LOAN AMOUNT DETAILS:-
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="minAmount"
                  className="text-gray-600 font-semibold"
                >
                  Min Amount
                </Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.amount.minimum}
                  onChange={(e) => handleChange(e, "amount", "minimum")}
                  className={`h-12 ${
                    getError("amount.minimum")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />

                {getError("amount.minimum") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("amount.minimum")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="maxAmount"
                  className="text-gray-600 font-semibold"
                >
                  Max Amount
                </Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.amount.maximum}
                  onChange={(e) => handleChange(e, "amount", "maximum")}
                  className={`h-12 ${
                    getError("amount.maximum")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />

                {getError("amount.maximum") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("amount.maximum")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interest and Tenure */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-black uppercase tracking-wide">
              INTEREST and TENURE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="interestRate"
                  className="text-gray-600 font-semibold"
                >
                  Interest rate
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => handleChange(e, "interestRate")}
                  className={`h-12 ${
                    getError("interestRate")
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />

                {getError("interestRate") && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError("interestRate")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 font-semibold">
                  Loan Tenure (Months)(Min & Max)
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min Tenure"
                    value={formData.tenure.minimum}
                    onChange={(e) => handleChange(e, "tenure", "minimum")}
                    className={`h-12 ${
                      getError("tenure.minimum")
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {getError("tenure.minimum") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError("tenure.minimum")}
                    </p>
                  )}

                  <Input
                    type="number"
                    placeholder="Max Tenure"
                    value={formData.tenure.maximum}
                    onChange={(e) => handleChange(e, "tenure", "maximum")}
                    className={`h-12 ${
                      getError("tenure.maximum")
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                  {getError("tenure.maximum") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError("tenure.maximum")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-black uppercase tracking-wide">
              ELIGIBILITY CRITERIA:-
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="minAge" className="text-gray-600 font-semibold">
                  Minimum Age
                </Label>
                <Input
                  type="number"
                  id="minAge"
                  value={formData.eligibility!.minAge}
                  onChange={(e) => handleChange(e, "eligibility", "minAge")}
className={`h-12 ${
                      getError("eligibility.minAge")
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}       
                             />

                             {getError("eligibility.minAge") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError("eligibility.minAge")}
                    </p>
                  )}


              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAge" className="text-gray-600 font-semibold">
                  Maximum Age
                </Label>
                <Input
                  id="maxAge"
                  type="number"
                  value={formData.eligibility!.maxAge}
                  onChange={(e) => handleChange(e, "eligibility", "maxAge")}
                  className={`h-12 ${
                      getError("eligibility.maxAge")
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}       
                             />

                             {getError("eligibility.maxAge") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError("eligibility.maxAge")}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="minSalary"
                  className="text-gray-600 font-semibold"
                >
                  Minimum Salary
                </Label>
                <Input
                  id="minSalary"
                  type="number"
                  value={formData.eligibility!.minSalary}
                  onChange={(e) => handleChange(e, "eligibility", "minSalary")}
                  className={`h-12 ${
                      getError("eligibility.minSalary")
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}       
                             />

                             {getError("eligibility.minSalary") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError("eligibility.minSalary")}
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cibilScore"
                  className="text-gray-600 font-semibold"
                >
                  CIBIL Score
                </Label>
                <Input
                  id="cibilScore"
                  type="number"
                  value={formData.eligibility!.cibilScore}
                  onChange={(e) => handleChange(e, "eligibility", "cibilScore")}
                  className={`h-12 ${
                      getError("eligibility.cibilScore")
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}       
                             />

                             {getError("eligibility.cibilScore") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getError("eligibility.cibilScore")}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          {/* Status Toggle */}
          <div className="flex gap-4">
            <Button
              variant={formData.status === "ACTIVE" ? "default" : "outline"}
              onClick={() =>
                setFormData((prev) => ({ ...prev, status:"ACTIVE" }))
              }
            >
              Active
            </Button>
            <Button
              variant={formData.status === "INACTIVE" ? "default" : "outline"}
              onClick={() =>
                setFormData((prev) => ({ ...prev, status:"INACTIVE" }))
              }
            >
              Inactive
            </Button>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-green-700 hover:bg-green-800"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
