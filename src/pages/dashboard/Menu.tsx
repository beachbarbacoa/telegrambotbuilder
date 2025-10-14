"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/utils/toast";
import { 
  DndContext, 
  DragEndEvent, 
  KeyboardSensor, 
  PointerSensor, 
  closestCenter, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu as MenuIcon, Plus, Trash2, Edit3 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  position: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  position: number;
  items: MenuItem[];
}

const SortableItem = ({ item, onEdit }: { 
  item: MenuItem; 
  onEdit: (item: MenuItem) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex justify-between items-center py-2 border-b border-gray-100"
    >
      <div className="flex items-center space-x-2">
        <button
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
        >
          <MenuIcon className="h-4 w-4 text-gray-500" />
        </button>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold">${item.price.toFixed(2)}</span>
        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const SortableCategory = ({ category, onEdit, onDelete, onItemEdit }: { 
  category: MenuCategory; 
  onEdit: (category: MenuCategory) => void;
  onDelete: (id: string) => void;
  onItemEdit: (item: MenuItem) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle drag end for items within this category
  const handleItemDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Update positions in database
      try {
        const oldIndex = category.items.findIndex((item) => item.id === active.id);
        const newIndex = category.items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(category.items, oldIndex, newIndex);
        
        // Update positions in database
        const updates = newItems.map((item, index) => 
          supabase
            .from('menu_items')
            .update({ position: index })
            .eq('id', item.id)
        );

        await Promise.all(updates);
      } catch (error) {
        showError("Failed to update item order");
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border rounded-lg p-4 mb-4 bg-white shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
          >
            <MenuIcon className="h-4 w-4 text-gray-500" />
          </button>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(category.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 ml-6">
        <DndContext
          sensors={useSensors(
            useSensor(PointerSensor),
            useSensor(KeyboardSensor, {
              coordinateGetter: sortableKeyboardCoordinates,
            })
          )}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd}
        >
          <SortableContext
            items={category.items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {category.items.map((item) => (
              <SortableItem 
                key={item.id} 
                item={item} 
                onEdit={onItemEdit} 
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button variant="outline" className="mt-2 w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

const Menu = () => {
  const { restaurant } = useAuth();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (restaurant) {
      fetchMenu();
    }
  }, [restaurant]);

  const fetchMenu = async () => {
    if (!restaurant) return;
    
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('position');

      if (categoriesError) {
        showError("Failed to fetch menu categories");
        return;
      }

      // Fetch items for each category
      const categoriesWithItems = await Promise.all(
        categoriesData.map(async (category) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('category_id', category.id)
            .order('position');

          if (itemsError) {
            showError(`Failed to fetch items for ${category.name}`);
            return { ...category, items: [] };
          }

          return { ...category, items: itemsData || [] };
        })
      );

      setCategories(categoriesWithItems);
    } catch (error) {
      showError("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      // Update positions in database
      try {
        const newCategories = arrayMove(categories, 
          categories.findIndex((item) => item.id === active.id),
          categories.findIndex((item) => item.id === over.id)
        );

        // Update positions in database
        const updates = newCategories.map((category, index) => 
          supabase
            .from('menu_categories')
            .update({ position: index })
            .eq('id', category.id)
        );

        await Promise.all(updates);
        showSuccess("Menu order updated successfully!");
      } catch (error) {
        showError("Failed to update menu order");
        // Revert the state if database update fails
        fetchMenu();
      }
    }
  };

  const handleAddCategory = async () => {
    if (!restaurant) return;

    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({
          restaurant_id: restaurant.id,
          name: categoryForm.name,
          description: categoryForm.description,
          position: categories.length,
        })
        .select()
        .single();

      if (error) {
        showError("Failed to add category");
        return;
      }

      setCategories([...categories, { ...data, items: [] }]);
      setCategoryForm({ name: "", description: "" });
      setShowCategoryForm(false);
      showSuccess("Category added successfully!");
    } catch (error) {
      showError("Failed to add category");
    }
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
    });
    setShowCategoryForm(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('menu_categories')
        .update({
          name: categoryForm.name,
          description: categoryForm.description,
        })
        .eq('id', editingCategory.id);

      if (error) {
        showError("Failed to update category");
        return;
      }

      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryForm } 
          : cat
      ));
      
      setEditingCategory(null);
      setCategoryForm({ name: "", description: "" });
      setShowCategoryForm(false);
      showSuccess("Category updated successfully!");
    } catch (error) {
      showError("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id);

      if (error) {
        showError("Failed to delete category");
        return;
      }

      setCategories(categories.filter(cat => cat.id !== id));
      showSuccess("Category deleted successfully!");
    } catch (error) {
      showError("Failed to delete category");
    }
  };

  const handleEditItem = (item: MenuItem) => {
    // TODO: Implement item editing
    console.log("Edit item:", item);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Button onClick={() => {
          setEditingCategory(null);
          setCategoryForm({ name: "", description: "" });
          setShowCategoryForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showCategoryForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  placeholder="e.g., Appetizers, Main Courses"
                />
              </div>
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Describe this category"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No categories yet. Add your first category to get started.</p>
            <Button onClick={() => {
              setEditingCategory(null);
              setCategoryForm({ name: "", description: "" });
              setShowCategoryForm(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onItemEdit={handleEditItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Menu;