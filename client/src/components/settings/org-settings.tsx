import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BuildingIcon,
  GlobeIcon,
  ShieldIcon,
  BellIcon,
  UploadIcon,
  PaletteIcon,
  FileTextIcon,
  DollarSignIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  EyeIcon,
  GitMergeIcon,
  FileIcon,
  MailIcon,
  MessageSquareIcon,
  AlertTriangleIcon,
  SaveIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Form sections for branding
const OrgBranding = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#6200EE");
  const [secondaryColor, setSecondaryColor] = useState("#03DAC6");
  const [customDomain, setCustomDomain] = useState("");
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Brand settings saved",
      description: "Your organization branding has been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BuildingIcon className="mr-2 h-5 w-5 text-primary" />
          Organization Branding
        </CardTitle>
        <CardDescription>
          Customize your organization's visual identity and branding elements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo-upload" className="text-base font-medium block mb-2">Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/25 rounded-md flex items-center justify-center bg-muted/30 overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Organization logo" className="max-w-full max-h-full" />
                ) : (
                  <BuildingIcon className="h-10 w-10 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex-1">
                <Label 
                  htmlFor="logo-upload" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <UploadIcon className="h-4 w-4 mr-2" /> Upload Logo
                </Label>
                <Input 
                  id="logo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended: 512x512px PNG or SVG with transparent background
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-base font-medium">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input 
                  id="primary-color" 
                  type="text" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-base font-medium">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: secondaryColor }}
                />
                <Input 
                  id="secondary-color" 
                  type="text" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-domain" className="text-base font-medium">Custom Domain</Label>
            <Input 
              id="custom-domain" 
              type="text" 
              placeholder="akses.yourcompany.com" 
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Set a custom domain for your organization's AKSES instance
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Document Templates</Label>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">PDF Header & Footer</Label>
                <Button variant="outline" size="sm">
                  <FileTextIcon className="h-4 w-4 mr-2" /> Customize
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Add your organization's header and footer for all generated PDF documents like IC Memos and reports.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Branding Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

// Organization Info section
const OrganizationInfo = () => {
  const [orgName, setOrgName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [fiscalYearStart, setFiscalYearStart] = useState("January");
  const [timezone, setTimezone] = useState("UTC");
  const [tags, setTags] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Organization info saved",
      description: "Your organization information has been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GlobeIcon className="mr-2 h-5 w-5 text-primary" />
          Organization Information
        </CardTitle>
        <CardDescription>
          Set your organization's basic information and regional preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="org-name" className="text-base font-medium">Organization Display Name</Label>
            <Input 
              id="org-name" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="AKSES Financial"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legal-name" className="text-base font-medium">Legal Entity Name</Label>
            <Input 
              id="legal-name" 
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="AKSES Financial Services, Inc."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-base font-medium">Country of Incorporation</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="SG">Singapore</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred-currency" className="text-base font-medium">Preferred Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="SGD">SGD (S$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fiscal-year" className="text-base font-medium">Fiscal Year Start Month</Label>
            <Select value={fiscalYearStart} onValueChange={setFiscalYearStart}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="October">October</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-base font-medium">Time Zone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-tags" className="text-base font-medium">Organization Tags</Label>
          <Input 
            id="org-tags" 
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="LATAM, PSAP, Tier-1 (comma separated values)"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Add tags to categorize your organization (e.g., LATAM, PSAP, Tier-1)
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Organization Info
        </Button>
      </CardFooter>
    </Card>
  );
};

// Access Controls section
const AccessControls = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const { toast } = useToast();

  const roles = [
    { id: "admin", name: "Administrator" },
    { id: "finance-lead", name: "Finance Lead" },
    { id: "analyst", name: "Credit Analyst" },
    { id: "viewer", name: "External Viewer" },
    { id: "partner", name: "Partner Organization" },
  ];

  const handleSave = () => {
    toast({
      title: "Access controls saved",
      description: "Your access control settings have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldIcon className="mr-2 h-5 w-5 text-primary" />
          Access Controls
        </CardTitle>
        <CardDescription>
          Configure role-based access control and visibility settings for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Role-Based Access Presets</Label>
          <div className="grid grid-cols-2 gap-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role to configure" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <UsersIcon className="h-4 w-4 mr-2" /> Create New Role
            </Button>
          </div>

          {selectedRole && (
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{roles.find(r => r.id === selectedRole)?.name} Role Configuration</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Duplicate</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">ACCESS PERMISSIONS</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label className="font-medium">View Deals Pipeline</Label>
                      <p className="text-sm text-muted-foreground">Access to view all deals in the pipeline</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label className="font-medium">Create New Deals</Label>
                      <p className="text-sm text-muted-foreground">Ability to create new deals</p>
                    </div>
                    <Switch defaultChecked={selectedRole === 'admin' || selectedRole === 'finance-lead'} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label className="font-medium">Edit Deal Information</Label>
                      <p className="text-sm text-muted-foreground">Can edit details of existing deals</p>
                    </div>
                    <Switch defaultChecked={selectedRole !== 'viewer'} />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label className="font-medium">Approve/Reject Deals</Label>
                      <p className="text-sm text-muted-foreground">Authority to approve or reject deals</p>
                    </div>
                    <Switch defaultChecked={selectedRole === 'admin' || selectedRole === 'finance-lead'} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">FIELD-LEVEL VISIBILITY</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label className="font-medium">Financial Metrics</Label>
                      <p className="text-sm text-muted-foreground">Net IRR, ROI, and other financial data</p>
                    </div>
                    <Switch defaultChecked={selectedRole !== 'viewer' && selectedRole !== 'partner'} />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label className="font-medium">Internal Comments</Label>
                      <p className="text-sm text-muted-foreground">Access to view internal notes and comments</p>
                    </div>
                    <Switch defaultChecked={selectedRole !== 'viewer' && selectedRole !== 'partner'} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 mt-6">
            <Label className="text-base font-medium">Workflow Stage Gating</Label>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">Configure Stage Requirements</Label>
                <Button variant="outline" size="sm">
                  <GitMergeIcon className="h-4 w-4 mr-2" /> Configure Stages
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Set required approvals or conditions before deals can progress to the next stage.
              </p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between text-sm rounded-md bg-muted/30 p-2">
                  <span className="font-medium">Pre-Screening → Due Diligence</span>
                  <span>Requires: Credit Analyst Approval</span>
                </div>
                <div className="flex items-center justify-between text-sm rounded-md bg-muted/30 p-2">
                  <span className="font-medium">Due Diligence → IC Submission</span>
                  <span>Requires: Credit Head Approval</span>
                </div>
                <div className="flex items-center justify-between text-sm rounded-md bg-muted/30 p-2">
                  <span className="font-medium">IC Submission → Approved</span>
                  <span>Requires: Investment Committee Vote (majority vote)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">File Upload Restrictions</Label>
            <div className="rounded-md border p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Allowed File Types</Label>
                    <p className="text-sm text-muted-foreground">Restrict uploads to specific file formats</p>
                  </div>
                  <Input className="w-1/2" defaultValue=".pdf, .xlsx, .docx, .pptx, .csv, .jpg, .png" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Maximum File Size</Label>
                    <p className="text-sm text-muted-foreground">Limit the size of uploaded files</p>
                  </div>
                  <div className="flex items-center space-x-2 w-1/2">
                    <Input type="number" defaultValue="25" className="w-20" />
                    <Select defaultValue="MB">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KB">KB</SelectItem>
                        <SelectItem value="MB">MB</SelectItem>
                        <SelectItem value="GB">GB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Access Controls
        </Button>
      </CardFooter>
    </Card>
  );
};

// Notification Preferences section
const NotificationPreferences = () => {
  const [deliveryChannel, setDeliveryChannel] = useState("email");
  const [frequency, setFrequency] = useState("realtime");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellIcon className="mr-2 h-5 w-5 text-primary" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure how and when you receive notifications from the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">Delivery Channels</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant={deliveryChannel === "email" ? "default" : "outline"}
                className={deliveryChannel === "email" ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setDeliveryChannel("email")}
              >
                <MailIcon className="h-4 w-4 mr-2" /> Email
              </Button>
              <Button 
                variant={deliveryChannel === "slack" ? "default" : "outline"}
                className={deliveryChannel === "slack" ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setDeliveryChannel("slack")}
              >
                <MessageSquareIcon className="h-4 w-4 mr-2" /> Slack
              </Button>
              <Button 
                variant={deliveryChannel === "sms" ? "default" : "outline"}
                className={deliveryChannel === "sms" ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setDeliveryChannel("sms")}
              >
                <MessageSquareIcon className="h-4 w-4 mr-2" /> SMS
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Notification Frequency</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant={frequency === "realtime" ? "default" : "outline"}
                className={frequency === "realtime" ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setFrequency("realtime")}
              >
                Real-time
              </Button>
              <Button 
                variant={frequency === "daily" ? "default" : "outline"}
                className={frequency === "daily" ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setFrequency("daily")}
              >
                Daily Digest
              </Button>
              <Button 
                variant={frequency === "weekly" ? "default" : "outline"}
                className={frequency === "weekly" ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setFrequency("weekly")}
              >
                Weekly Summary
              </Button>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-base font-medium">Event-based Notifications</Label>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Event</th>
                    <th className="text-center p-3 font-medium">Email</th>
                    <th className="text-center p-3 font-medium">Slack</th>
                    <th className="text-center p-3 font-medium">SMS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Deal Submitted</td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Loan Tape Uploaded</td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Memo Approved</td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch defaultChecked /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">New Comment Added</td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch /></td>
                    <td className="text-center"><Switch /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Stage Changed</td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch defaultChecked /></td>
                    <td className="text-center"><Switch /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label className="text-base font-medium">Threshold Alerts</Label>
            <div className="rounded-md border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <AlertTriangleIcon className="h-4 w-4 mr-2" /> Add Alert Condition
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="rounded-md bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">NAR Falls Below Threshold</p>
                        <p className="text-sm text-muted-foreground">Alert if Net Annualized Return is below 24%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">High Default Rate</p>
                        <p className="text-sm text-muted-foreground">Alert if Loan Default Rate exceeds 6%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Portfolio Concentration</p>
                        <p className="text-sm text-muted-foreground">Alert if Single Sector Exposure exceeds 40%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main OrgSettings component
export function OrgSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Organization Settings</h2>
      </div>
      
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="branding" className="flex items-center gap-1">
            <BuildingIcon className="h-4 w-4" /> Org Branding
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-1">
            <GlobeIcon className="h-4 w-4" /> Organization Info
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-1">
            <ShieldIcon className="h-4 w-4" /> Access Controls
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <BellIcon className="h-4 w-4" /> Notification Preferences
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding" className="space-y-4">
          <OrgBranding />
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4">
          <OrganizationInfo />
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4">
          <AccessControls />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}