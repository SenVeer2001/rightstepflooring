import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Edit2 } from 'lucide-react';
import { mockCourses, mockCategories } from '../mockData';
import Select from '../../../components/ui/Select';

interface CourseFormData {
  name: string
  category: string
  subcategory: string
  description: string
}

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isViewMode, setIsViewMode] = useState( id !== undefined);

  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    category: '',
    subcategory: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Pre-fill if editing existing course
  React.useEffect(() => {
    if (id) {
      const course = mockCourses.find((c) => c.id === id);
      if (course) {
        setFormData({
          name: course.name,
          category: course.category,
          subcategory: course.subcategory,
          description: course.description,
        });
      }
    } else if (!id) {
      // Reset form when creating new course
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        description: '',
      });
      setIsViewMode(false);
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.subcategory) {
      newErrors.subcategory = 'Subcategory is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`Course "${formData.name}" ${!id? 'created' : 'updated'} successfully!`);
      navigate('/training/courses');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/training/courses');
  };

  const filledFields = [formData.name, formData.category, formData.subcategory, formData.description].filter(Boolean).length;

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="  mb-6">
        <div className=" px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/training/courses')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isViewMode ? 'View Course' : !id ? 'Create Course' : 'Edit Course'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isViewMode
                    ? 'Review course information'
                    : !id
                    ? 'Add new course with details'
                    : 'Update course information'}
                </p>
              </div>
            </div>
            {/* {isViewMode && (
              <button
                onClick={() => navigate(`/training/courses/edit/${id}`)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#2c621b] text-white rounded-lg transition-colors font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )} */}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {isViewMode ? (
            // View Mode
            <div className="space-y-8">
              {/* Course Name */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Course Name
                </label>
                <p className="text-xl font-bold text-gray-900">{formData.name}</p>
              </div>

              {/* Category & Subcategory Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Category
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{formData.category}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Subcategory
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{formData.subcategory}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  Description
                </label>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.description}</p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900">Next Steps</h3>
                <p className="text-sm text-blue-800 mt-2">
                  Click Edit to modify this course, or go to Course Builder to add questions and groups.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center text-sm gap-3 pt-6 border-t border-gray-200">
                <button
                   onClick={() => navigate(`/training/courses/edit/${id}`)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-[#2c621b] text-white rounded-lg transition-colors font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Course
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>
          ) : (
            // Edit/Create Mode
            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Course Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter course name"
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white focus:border-primary'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>

              {/* Category & Subcategory Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(value: string) => handleChange({ target: { name: 'category', value } } as React.ChangeEvent<HTMLSelectElement>)}
                  >
                    <option value="">Select category</option>
                    {mockCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Subcategory */}
                <div>
                  <Select
                    label="Subcategory"
                    value={formData.subcategory}
                    onChange={(value: string) => handleChange({ target: { name: 'subcategory', value } } as React.ChangeEvent<HTMLSelectElement>)}
                  >
                    <option value="">Select subcategory</option>
                    {mockCategories
                      .find((c) => c.name === formData.category)
                      ?.subcategories.map((subcat) => (
                        <option key={subcat.id} value={subcat.name}>
                          {subcat.name}
                        </option>
                      ))}
                  </Select>
                  {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white focus:border-primary'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2 font-semibold">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900">Next Steps</h3>
                <p className="text-sm text-blue-800 mt-2">
                  Save course details first, then add questions and groups from the Course Builder.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-[#2c621b] text-white rounded-lg disabled:bg-gray-400 transition-colors font-semibold"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : !id ? 'Create Course' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-semibold"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Course Info Sidebar */}
        {!isViewMode && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
            {formData.name && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Preview</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Name</p>
                    <p className="text-sm font-bold mt-2 text-primary">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Category</p>
                    <p className="text-sm font-bold text-gray-900 mt-2">{formData.category || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Subcategory</p>
                    <p className="text-sm font-bold text-gray-900 mt-2">{formData.subcategory || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full transition-colors ${formData.name ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  <span className={`text-sm font-medium ${formData.name ? 'text-gray-900' : 'text-gray-600'}`}>Course name</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full transition-colors ${formData.category ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  <span className={`text-sm font-medium ${formData.category ? 'text-gray-900' : 'text-gray-600'}`}>Category</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full transition-colors ${formData.subcategory ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  <span className={`text-sm font-medium ${formData.subcategory ? 'text-gray-900' : 'text-gray-600'}`}>Subcategory</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full transition-colors ${formData.description ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  <span className={`text-sm font-medium ${formData.description ? 'text-gray-900' : 'text-gray-600'}`}>Description</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Form Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600">Filled fields</span>
                  <span className="text-sm font-bold text-primary bg-green-50 px-3 py-1 rounded-full">
                    {filledFields}/4
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(filledFields / 4) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 font-medium">{Math.round((filledFields / 4) * 100)}% Complete</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
