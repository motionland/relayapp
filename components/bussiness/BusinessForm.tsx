"use client"

import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector, submitBusinessApplication, api, fetchBusinessStatus } from "@/redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// schema (match Laravel validation)
const schema = z.object({
  business_name: z.string().min(1, "Required"),
  business_type: z.enum(["sole_proprietorship", "partnership", "corporation", "llc", "other"], {
    errorMap: () => ({ message: "Select valid business type" }),
  }),
  industry: z.enum([
    "retail",
    "healthcare",
    "logistics",
    "technology",
    "food&beverage",
    "construction",
    "finance",
    "realEstate",
    "manufacturing",
    "education",
    "consulting",
    "transportation",
    "entertainment",
    "hospitality",
    "agriculture",
  ], { errorMap: () => ({ message: "Select valid industry" }) }),
  tax_id: z.string().min(1, "Required"),
  primary_contact_name: z.string().min(1, "Required"),
  primary_contact_title: z.string().min(1, "Required"),
  phone_number: z.string().min(1, "Required"),
  email_address: z.string().email("Invalid email"),
  address_street: z.string().min(1, "Required"),
  address_suite: z.string().min(1, "Required"),
  address_city: z.string().min(1, "Required"),
  address_state: z.string().min(1, "Required"),
  address_zip: z.string().min(1, "Required"),
  notification_preferences: z.array(z.enum(["email", "text", "phone_call"])).min(1, "Select at least one notification preference"),
  terms_accepted: z.boolean().refine((val) => val, { message: "You must accept terms" }),
})

type FormSchema = z.infer<typeof schema>

export default function BusinessForm() {
  const dispatch = useAppDispatch()
  const { loading, error, uploadProgress, status, data } = useAppSelector((s) => s.business)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      terms_accepted: false,
      notification_preferences: [],
    },
  })

  const onSubmit = async (values: FormSchema) => {
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => fd.append(`${k}[]`, val))
      } else if (typeof v === "boolean") {
        fd.append(k, v ? "1" : "0")
      } else if (v !== undefined && v !== null) {
        fd.append(k, String(v))
      }
    })

    ;[
      "file_business_registration_certificate",
      "file_tax_id_certificate",
      "file_government_issued_id",
      "file_utility_bill",
    ].forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null
      if (el?.files?.[0]) fd.append(id, el.files[0])
    })

    dispatch(submitBusinessApplication(fd))
  }

  const handleApprove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await api.post(`/admin/bussiness/${data.id}/approve`);
      console.log("Approved successfully:", res.data);
      // Bisa tambah notifikasi / refresh data
      dispatch(fetchBusinessStatus())
    } catch (err) {
      console.error("Error approving business:", err);
    }
  };


  return (
    <Card className="mx-auto shadow-none border-none">
      <CardHeader className="flex ">
        <CardTitle>Business Application Form</CardTitle>
        {status === "pending" && (
          <Button onClick={handleApprove}>
            Admin approval simulation
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* basic info */}
          <div>
            <Label>Business Name</Label>
            <Input {...register("business_name")} />
            {errors.business_name && <p className="text-red-500 text-xs">{errors.business_name.message}</p>}
          </div>

          <div>
            <Label>Business Type</Label>
            <select {...register("business_type")} className="border rounded px-3 py-2 w-full">
              <option value="">-- Select --</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="corporation">Corporation</option>
              <option value="llc">LLC</option>
              <option value="other">Other</option>
            </select>
            {errors.business_type && <p className="text-red-500 text-xs">{errors.business_type.message}</p>}
          </div>

          <div>
            <Label>Industry</Label>
            <select {...register("industry")} className="border rounded px-3 py-2 w-full">
              <option value="">-- Select --</option>
              <option value="retail">Retail</option>
              <option value="healthcare">Healthcare</option>
              <option value="logistics">Logistics</option>
              <option value="technology">Technology</option>
              <option value="food&beverage">Food & Beverage</option>
              <option value="construction">Construction</option>
              <option value="finance">Finance</option>
              <option value="realEstate">Real Estate</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="education">Education</option>
              <option value="consulting">Consulting</option>
              <option value="transportation">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="hospitality">Hospitality</option>
              <option value="agriculture">Agriculture</option>
            </select>
            {errors.industry && <p className="text-red-500 text-xs">{errors.industry.message}</p>}
          </div>

          <div>
            <Label>Tax ID</Label>
            <Input {...register("tax_id")} />
            {errors.tax_id && <p className="text-red-500 text-xs">{errors.tax_id.message}</p>}
          </div>

          <div>
            <Label>Primary Contact Name</Label>
            <Input {...register("primary_contact_name")} />
            {errors.primary_contact_name && <p className="text-red-500 text-xs">{errors.primary_contact_name.message}</p>}
          </div>

          <div>
            <Label>Primary Contact Title</Label>
            <Input {...register("primary_contact_title")} />
            {errors.primary_contact_title && <p className="text-red-500 text-xs">{errors.primary_contact_title.message}</p>}
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input {...register("phone_number")} />
            {errors.phone_number && <p className="text-red-500 text-xs">{errors.phone_number.message}</p>}
          </div>

          <div>
            <Label>Email Address</Label>
            <Input type="email" {...register("email_address")} />
            {errors.email_address && <p className="text-red-500 text-xs">{errors.email_address.message}</p>}
          </div>

          {/* address */}
          <div>
            <Label>Street</Label>
            <Input {...register("address_street")} />
            {errors.address_street && <p className="text-red-500 text-xs">{errors.address_street.message}</p>}
          </div>

          <div>
            <Label>Suite</Label>
            <Input {...register("address_suite")} />
            {errors.address_suite && <p className="text-red-500 text-xs">{errors.address_suite.message}</p>}
          </div>

          <div className="col-span-2 grid grid-cols-3 gap-2">
            <div>
              <Label>City</Label>
              <Input {...register("address_city")} />
              {errors.address_city && <p className="text-red-500 text-xs">{errors.address_city.message}</p>}
            </div>

            <div>
              <Label>State</Label>
              <Input {...register("address_state")} />
              {errors.address_state && <p className="text-red-500 text-xs">{errors.address_state.message}</p>}
            </div>

            <div>
              <Label>ZIP</Label>
              <Input {...register("address_zip")} />
              {errors.address_zip && <p className="text-red-500 text-xs">{errors.address_zip.message}</p>}
            </div>
          </div>

          {/* notification preferences */}
          <div className="md:col-span-2">
            <Label>Notification Preferences</Label>
            <div className="flex flex-col gap-2">
              {["email", "text", "phone_call"].map((opt) => (
                <Controller
                  key={opt}
                  name="notification_preferences"
                  control={control}
                  render={({ field }) => {
                    const value = field.value || []
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`notif-${opt}`}
                          checked={value.includes(opt)}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange([...value, opt])
                            else field.onChange(value.filter((v: string) => v !== opt))
                          }}
                        />
                        <Label htmlFor={`notif-${opt}`}>{opt}</Label>
                      </div>
                    )
                  }}
                />
              ))}
            </div>
            {errors.notification_preferences && (
              <p className="text-red-500 text-sm">{errors.notification_preferences.message}</p>
            )}
          </div>

          {/* files */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Business Registration Certificate</Label>
              <Input id="file_business_registration_certificate" type="file" />
            </div>
            <div>
              <Label>Tax ID Certificate</Label>
              <Input id="file_tax_id_certificate" type="file" />
            </div>
            <div>
              <Label>Government Issued ID</Label>
              <Input id="file_government_issued_id" type="file" />
            </div>
            <div>
              <Label>Utility Bill</Label>
              <Input id="file_utility_bill" type="file" />
            </div>
          </div>

          {/* terms */}
          <div className="flex items-center space-x-2 md:col-span-2">
            <Controller
              name="terms_accepted"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val === true)}
                  />
                  <Label htmlFor="terms">I accept the terms and conditions</Label>
                </>
              )}
            />
          </div>
          {errors.terms_accepted && (
            <p className="text-red-500 text-sm md:col-span-2">
              {errors.terms_accepted.message}
            </p>
          )}

          <div className="md:col-span-2">
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>

        {/* feedback */}
        {uploadProgress !== null && <p className="mt-4">Upload progress: {uploadProgress}%</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {status === "pending" && <p className="text-yellow-600 mt-2">Application under review...</p>}
      </CardContent>
    </Card>
  )
}
