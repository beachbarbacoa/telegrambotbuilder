"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/utils/toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: "RestaurantBot Platform",
    supportEmail: "support@restaurantbot.com",
    maintenanceMode: false,
    orderNotificationEmail: true,
    orderNotificationSMS: false,
    paymentProcessingFee: 2.5,
    termsOfService: "",
    privacyPolicy: "",
  });

  const handleSave = () => {
    showSuccess("Settings saved successfully!");
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-500">
                  Temporarily disable the platform for maintenance
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Send order notifications via email
                </p>
              </div>
              <Switch
                checked={settings.orderNotificationEmail}
                onCheckedChange={(checked) => handleChange("orderNotificationEmail", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">
                  Send order notifications via SMS
                </p>
              </div>
              <Switch
                checked={settings.orderNotificationSMS}
                onCheckedChange={(checked) => handleChange("orderNotificationSMS", checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentProcessingFee">Payment Processing Fee (%)</Label>
              <Input
                id="paymentProcessingFee"
                type="number"
                step="0.1"
                value={settings.paymentProcessingFee}
                onChange={(e) => handleChange("paymentProcessingFee", parseFloat(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Legal Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Terms of Service</Label>
              <Textarea
                value={settings.termsOfService}
                onChange={(e) => handleChange("termsOfService", e.target.value)}
                rows={6}
                placeholder="Enter your terms of service..."
              />
            </div>
            
            <div>
              <Label>Privacy Policy</Label>
              <Textarea
                value={settings.privacyPolicy}
                onChange={(e) => handleChange("privacyPolicy", e.target.value)}
                rows={6}
                placeholder="Enter your privacy policy..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;