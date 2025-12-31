import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useDeleteProductImageMutation,
} from '../../../features/products/productApi';
import { useGetAllCategoriesQuery } from '../../../features/categories/categoryApi';
import ImageCropper from '../../../components/common/ImageCropper';
import { Loader2, ArrowLeft, Save, X, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    careInstructions: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  // Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<string | null>(
    null,
  );

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductByIdQuery(Number(id), { skip: !isEditMode });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    if (productData?.product) {
      const p = productData.product;
      setFormData({
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock.toString(),
        categoryId: p.categoryId.toString(),
        careInstructions: p.careInstructions || '',
      });
      setExistingImages(p.images || []);
    }
  }, [productData]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentImageToCrop(imageUrl);
      setShowCropper(true);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setSelectedImages((prev) => [...prev, croppedFile]);
    const newPreviewUrl = URL.createObjectURL(croppedFile);
    setPreviewUrls((prev) => [...prev, newPreviewUrl]);

    // Close cropper
    setShowCropper(false);
    setCurrentImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setCurrentImageToCrop(null);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const [deleteProductImage] = useDeleteProductImageMutation();

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteProductImage(imageId).unwrap();
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('categoryId', formData.categoryId);
    data.append('careInstructions', formData.careInstructions);

    selectedImages.forEach((image) => {
      data.append('images', image);
    });

    try {
      if (isEditMode) {
        await updateProduct({ id: Number(id), data }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct(data).unwrap();
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to save product');
    }
  };

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  const isSaving = isCreating || isUpdating;
  const categories = categoriesData?.data?.categories || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Cropper Modal */}
      {showCropper && currentImageToCrop && (
        <ImageCropper
          image={currentImageToCrop}
          onCancel={handleCropCancel}
          onCropComplete={handleCropComplete}
          aspect={1} // Square aspect ratio for product images
        />
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Monstera Deliciosa"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Detailed product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Care Instructions
              </label>
              <textarea
                name="careInstructions"
                rows={3}
                value={formData.careInstructions}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Watering, sunlight, and soil needs..."
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Images
            </h2>

            <div className="space-y-4">
              {/* Existing Images (Edit Mode) */}
              {isEditMode && existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Current Images:</p>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {existingImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative w-24 h-24 flex-shrink-0 group"
                      >
                        <img
                          src={img.url}
                          alt="Product"
                          className="w-full h-full object-cover rounded-lg border dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                          title="Delete Image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                    <Upload size={24} />
                  </div>
                  <p className="font-medium">Click to upload image</p>
                  <p className="text-xs">PNG, JPG up to 5MB (One by one)</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  // Removed 'multiple' to force single file selection for cropping
                  onChange={handleImageChange}
                />
              </div>

              {/* Preview Grid */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                  {previewUrls.map((url, idx) => (
                    <div key={url} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg border dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organization
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg shadow-green-600/20"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving Product...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
