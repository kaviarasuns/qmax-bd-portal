"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CalendarIcon,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  linkedIn: z.string().url("Invalid LinkedIn URL"),
});

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().url("Invalid website URL"),
  linkedIn: z.string().url("Invalid LinkedIn URL"),
  country: z.string().min(1, "Country is required"),
  headquarters: z.string().min(1, "Headquarters location is required"),
  companyType: z.enum(["Public", "Private", "Startup", "Non-profit"]),
  industry: z.string().min(1, "Industry is required"),
  endProduct: z.string().min(1, "End product/services is required"),
  employees: z.string().min(1, "Number of employees is required"),
  ceoName: z.string().min(1, "CEO name is required"),
  ceoLinkedIn: z.string().url("Invalid LinkedIn URL"),
  ceoEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  fundingStage: z.string().optional(),
  rdLocations: z.string().optional(),
  potentialNeeds: z.string().optional(),
  contacts: z.array(contactSchema).min(1, "At least one contact is required"),
  notes: z.string().optional(),
  dateTime: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProspectSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProspectIndex, setCurrentProspectIndex] = useState(0);

  // Add the mutation hooks
  const updateProspect = useMutation(api.myFunctions.updateCompanyProspect);

  // Fetch only approved prospects
  const prospects =
    useQuery(api.myFunctions.listCompanyProspectsByStatus, {
      status: "Approved",
      limit: 50,
    }) || [];
  const currentProspect = prospects[currentProspectIndex];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: currentProspect?.companyName || "",
      website: currentProspect?.website || "",
      linkedIn: currentProspect?.linkedIn || "",
      country: currentProspect?.country || "",
      headquarters: currentProspect?.headquarters || "",
      companyType:
        (currentProspect?.companyType as
          | "Public"
          | "Private"
          | "Startup"
          | "Non-profit") || "Private",
      industry: currentProspect?.industry || "",
      endProduct: currentProspect?.endProduct || "",
      employees: currentProspect?.employees || "",
      ceoName: currentProspect?.ceoName || "",
      ceoLinkedIn: currentProspect?.ceoLinkedIn || "",
      ceoEmail: currentProspect?.ceoEmail || "",
      phoneNumber: currentProspect?.phoneNumber || "",
      fundingStage: currentProspect?.fundingStage || "",
      rdLocations: currentProspect?.rdLocations || "",
      potentialNeeds: currentProspect?.potentialNeeds || "",
      contacts: currentProspect?.contacts || [{ email: "", linkedIn: "" }],
      notes: currentProspect?.notes || "",
      dateTime: currentProspect?.dateTime
        ? new Date(currentProspect.dateTime)
        : new Date(),
    },
  });

  // Update form when currentProspect changes
  useEffect(() => {
    if (!currentProspect) return;

    form.reset({
      companyName: currentProspect?.companyName || "",
      website: currentProspect?.website || "",
      linkedIn: currentProspect?.linkedIn || "",
      country: currentProspect?.country || "",
      headquarters: currentProspect?.headquarters || "",
      companyType:
        (currentProspect?.companyType as
          | "Public"
          | "Private"
          | "Startup"
          | "Non-profit") || "Private",
      industry: currentProspect?.industry || "",
      endProduct: currentProspect?.endProduct || "",
      employees: currentProspect?.employees || "",
      ceoName: currentProspect?.ceoName || "",
      ceoLinkedIn: currentProspect?.ceoLinkedIn || "",
      ceoEmail: currentProspect?.ceoEmail || "",
      phoneNumber: currentProspect?.phoneNumber || "",
      fundingStage: currentProspect?.fundingStage || "",
      rdLocations: currentProspect?.rdLocations || "",
      potentialNeeds: currentProspect?.potentialNeeds || "",
      contacts: currentProspect?.contacts || [{ email: "", linkedIn: "" }],
      notes: currentProspect?.notes || "",
      dateTime: currentProspect?.dateTime
        ? new Date(currentProspect.dateTime)
        : new Date(),
    });
  }, [currentProspect, form]);

  const navigateToNextProspect = () => {
    if (currentProspectIndex < prospects.length - 1) {
      setCurrentProspectIndex(currentProspectIndex + 1);
    }
  };

  const navigateToPreviousProspect = () => {
    if (currentProspectIndex > 0) {
      setCurrentProspectIndex(currentProspectIndex - 1);
    }
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      if (!currentProspect?._id) {
        throw new Error("No prospect ID found");
      }

      // Ensure all required fields are strings (not undefined)
      await updateProspect({
        id: currentProspect._id,
        companyName: data.companyName,
        website: data.website,
        linkedIn: data.linkedIn,
        country: data.country,
        headquarters: data.headquarters,
        companyType: data.companyType,
        industry: data.industry,
        endProduct: data.endProduct,
        employees: data.employees,
        ceoName: data.ceoName,
        ceoLinkedIn: data.ceoLinkedIn,
        ceoEmail: data.ceoEmail,
        phoneNumber: data.phoneNumber,
        fundingStage: data.fundingStage || "",
        rdLocations: data.rdLocations || "",
        potentialNeeds: data.potentialNeeds || "",
        contacts: data.contacts,
        notes: data.notes || "",
        status: "Submitted",
      });

      toast.success("Company prospect updated successfully!");
    } catch (error) {
      toast.error("Failed to update company prospect. Please try again.");
      console.error("Error updating prospect:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSave() {
    setIsSaving(true);
    try {
      if (!currentProspect?._id) {
        throw new Error("No prospect ID found");
      }

      const formData = form.getValues();
      await updateProspect({
        id: currentProspect._id,
        companyName: formData.companyName,
        website: formData.website,
        linkedIn: formData.linkedIn,
        country: formData.country,
        headquarters: formData.headquarters,
        companyType: formData.companyType,
        industry: formData.industry,
        endProduct: formData.endProduct,
        employees: formData.employees,
        ceoName: formData.ceoName,
        ceoLinkedIn: formData.ceoLinkedIn,
        ceoEmail: formData.ceoEmail,
        phoneNumber: formData.phoneNumber,
        fundingStage: formData.fundingStage || "",
        rdLocations: formData.rdLocations || "",
        potentialNeeds: formData.potentialNeeds || "",
        contacts: formData.contacts,
        notes: formData.notes || "",
        status: "Approved",
      });

      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to save draft. Please try again.");
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const addContact = () => {
    const currentContacts = form.getValues("contacts") || [];
    form.setValue("contacts", [
      ...currentContacts,
      { email: "", linkedIn: "" },
    ]);
  };

  const removeContact = (index: number) => {
    const currentContacts = form.getValues("contacts");
    if (currentContacts.length > 1) {
      form.setValue(
        "contacts",
        currentContacts.filter((_, i) => i !== index),
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={navigateToPreviousProspect}
              disabled={currentProspectIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Prospect {currentProspectIndex + 1} of {prospects.length}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={navigateToNextProspect}
              disabled={currentProspectIndex === prospects.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full name of the company"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/company/example"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Country where company operates"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headquarters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="Non-profit">Non-profit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry / Sector</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., Medical Devices, IoT, Automotive"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Product / Services</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What the company manufactures or offers"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input placeholder="Approx. count or range" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ceoName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEO Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of the CEO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ceoLinkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEO LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/ceo-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ceoEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEO Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ceo@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="General or direct line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fundingStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Stage</FormLabel>
                    <FormControl>
                      <Input placeholder="Seed / Series A / etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rdLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>R&D / Design Locations</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Engineering/design office locations"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="potentialNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potential Needs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="PCB Design / Firmware / Hardware / Manufacturing / ID /Mech"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date and Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8">
              <Label className="text-base">
                Contact Information (10 contacts)
              </Label>
              <div className="space-y-4 mt-4">
                {form.watch("contacts").map((_, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email {index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="contact@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`contacts.${index}.linkedIn`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact LinkedIn {index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/contact"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeContact(index)}
                      className="mb-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addContact}
                  disabled={form.watch("contacts").length >= 10}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Contact {form.watch("contacts").length}/10
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional remarks or observations"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={onSave}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting || isSaving}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
