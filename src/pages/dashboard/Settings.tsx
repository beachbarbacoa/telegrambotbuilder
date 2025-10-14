"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TelegramBotService } from "@/services/telegramBotService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { showError, showSuccess } from "@/utils/toast";
import { Bot, Copy, RefreshCw } from "lucide-react";

interface TelegramBot {
  id: string;
  token: string;
  username: string;
  is_active: boolean;
  created_at: string;
  restaurant_id: string;
}

const Settings = () => {
  const { restaurant } = useAuth();
  const [bot, setBot] = useState<TelegramBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (restaurant) {
      fetchBot();
    }
  }, [restaurant]);

  const fetchBot = async () => {
    if (!restaurant) return;
    
    try {
      const result = await TelegramBotService.getBot(restaurant.id);
      if (result.success && result.bot) {
        setBot(result.bot as TelegramBot);
      }
    } catch (error) {
      console.error('Error fetching bot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBot = async () => {
    if (!restaurant) return;
    
    setCreating(true);
    
    try {
      const result = await TelegramBotService.createBot(restaurant.id, restaurant.name);
      if (result.success && result.bot) {
        setBot(result.bot as TelegramBot);
        showSuccess("Telegram bot created successfully!");
      } else {
        showError(result.error || "Failed to create Telegram bot");
      }
    } catch (error) {
      showError("Failed to create Telegram bot");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleBot = async (checked: boolean) => {
    if (!bot || !restaurant) return;
    
    setUpdating(true);
    
    try {
      const result = await TelegramBotService.updateBot(restaurant.id, { is_active: checked });
      if (result.success) {
        setBot({ ...bot, is_active: checked });
        showSuccess(`Bot ${checked ? 'activated' : 'deactivated'} successfully!`);
      } else {
        showError(result.error || "Failed to update bot status");
      }
    } catch (error) {
      showError("Failed to update bot status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!bot || !restaurant) return;
    
    if (!confirm("Are you sure you want to delete this bot? This action cannot be undone.")) {
      return;
    }
    
    setUpdating(true);
    
    try {
      const result = await TelegramBotService.deleteBot(restaurant.id);
      if (result.success) {
        setBot(null);
        showSuccess("Bot deleted successfully!");
      } else {
        showError(result.error || "Failed to delete bot");
      }
    } catch (error) {
      showError("Failed to delete bot");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              Telegram Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bot ? (
              <div className="space-y-6">
                <div>
                  <Label>Bot Username</Label>
                  <div className="flex items-center mt-1">
                    <Input 
                      value={`@${bot.username}`} 
                      readOnly 
                      className="flex-1" 
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => copyToClipboard(`@${bot.username}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Share this username with your customers to start receiving orders
                  </p>
                </div>
                
                <div>
                  <Label>Bot Token</Label>
                  <div className="flex items-center mt-1">
                    <Input 
                      value={bot.token} 
                      readOnly 
                      type="password"
                      className="flex-1" 
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => copyToClipboard(bot.token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Keep this token secure. Do not share it with anyone.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Bot Status</Label>
                    <p className="text-sm text-gray-500">
                      {bot.is_active ? "Active and receiving orders" : "Inactive"}
                    </p>
                  </div>
                  <Switch
                    checked={bot.is_active}
                    onCheckedChange={handleToggleBot}
                    disabled={updating}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteBot}
                    disabled={updating}
                  >
                    Delete Bot
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No Telegram Bot</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create a Telegram bot to start receiving orders from customers
                </p>
                <div className="mt-6">
                  <Button 
                    onClick={handleCreateBot}
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Telegram Bot"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bot Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Order Notification Settings</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Configure how you receive order notifications
                </p>
              </div>
              
              <div>
                <Label>Business Hours</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Set your business hours for order acceptance
                </p>
              </div>
              
              <div>
                <Label>Custom Messages</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Customize messages sent to customers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;