import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users as StudentsIcon, Plus, Search, Edit3, Trash2, X, Phone, MapPin, BookOpen, Calendar, Mail, ChevronLeft, ChevronRight, Filter, User, AlertCircle, Upload, FileSpreadsheet, Download, CheckCircle, XCircle, Briefcase, Sparkles } from 'lucide-react';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        course: '',
        department: '',
        hobbies: '',
        gender: '',
        address: '',
        emergencyContact: {
            name: '',
            phone: '',
            relation: ''
        },
        status: 'Active'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalStudents, setTotalStudents] = useState(0);

    // Import states
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [courseFilter, setCourseFilter] = useState('');





    const token = localStorage.getItem('token');

    const courses = [
        'Computer Science',
        'Engineering',
        'Business',
        'Arts',
        'Science',
        'Mathematics',
        'Literature',
        'Medicine'
    ];

    const department = [
        'Tech',
        'Non-Tech',
        'Design'
    ];

    const hobbies = [
        'Music',
        'Dancing',
        'Painting',
        'Traveling'
    ];

    const statuses = ['Active', 'Inactive', 'Graduated', 'Dropped'];

    useEffect(() => {
        fetchStudents(1, '', courseFilter);
    }, [token]);

    const fetchStudents = async (page = 1, search = '', course = '') => {
        try {
            const res = await axios.get(`http://localhost:5050/students?page=${page}&limit=7&search=${search}&course=${course}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(res.data.students);
            setCurrentPage(res.data.pagination.currentPage);
            setTotalPages(res.data.pagination.totalPages);
            setTotalStudents(res.data.pagination.totalStudents);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        }
    };

    const handleCourseFilter = (course) => {
        setCourseFilter(course);
        setCurrentPage(1);
        fetchStudents(1, searchTerm, course);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('emergencyContact.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                emergencyContact: {
                    ...formData.emergencyContact,
                    [field]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const res = await axios.put(`http://localhost:5050/students/${editingStudentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(students.map(student =>
                    student._id === editingStudentId ? res.data.student : student
                ));
                showNotification(`Student "${formData.fullName}" updated successfully!`, 'success');
            } else {
                const res = await axios.post('http://localhost:5050/students', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents([res.data.student, ...students]);
                showNotification(`Student "${formData.fullName}" added successfully!`, 'success');
            }
            closeModal();
        } catch (err) {
            console.error('Error submitting form:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred';
            showNotification(errorMessage, 'error');
        }
    };


    const handleEdit = (student) => {
        setIsEditMode(true);
        setEditingStudentId(student._id);
        setFormData({
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
            age: student.age.toString(),
            course: student.course,
            department: student.department,
            hobbies: student.hobbies,
            gender: student.gender,
            address: student.address,
            emergencyContact: student.emergencyContact || { name: '', phone: '', relation: '' },
            status: student.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (studentId) => {
        const studentToDelete = students.find(student => student._id === studentId);
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`http://localhost:5050/students/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(students.filter(student => student._id !== studentId));
                showNotification(`Student "${studentToDelete?.fullName}" deleted successfully!`, 'success');
            } catch (err) {
                console.error('Error deleting student:', err);
                const errorMessage = err.response?.data?.message || 'Failed to delete student';
                showNotification(errorMessage, 'error');
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingStudentId(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            age: '',
            course: '',
            department: '',
            hobbies: '',
            gender: '',
            address: '',
            emergencyContact: { name: '', phone: '', relation: '' },
            status: 'Active'
        });
    };

    const openAddModal = () => {
        setIsEditMode(false);
        setEditingStudentId(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            age: '',
            course: '',
            department: '',
            hobbies: '',
            gender: '',
            address: '',
            emergencyContact: { name: '', phone: '', relation: '' },
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        fetchStudents(1, value, courseFilter);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchStudents(page, searchTerm, courseFilter);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'graduated':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'dropped':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Import functions
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewData(null);
            setImportResult(null);
        }
    };

    const handlePreviewExcel = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        setIsPreviewLoading(true);
        const formData = new FormData();
        formData.append('excelFile', selectedFile);

        try {
            const res = await axios.post('http://localhost:5050/students/excel/preview', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPreviewData(res.data);
        } catch (err) {
            console.error('Error previewing Excel:', err);
            alert(err.response?.data?.message || 'Failed to preview Excel file');
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleImportStudents = async () => {
        if (!previewData || previewData.validRows === 0) {
            alert('No valid students to import');
            return;
        }

        setIsImporting(true);
        const validStudents = previewData.data.filter(row => row.errors.length === 0);

        try {
            const res = await axios.post('http://localhost:5050/students/excel/import', {
                validStudents
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setImportResult(res.data);
            fetchStudents(1, searchTerm, courseFilter); // Refresh the student list
        } catch (err) {
            console.error('Error importing students:', err);
            alert(err.response?.data?.message || 'Failed to import students');
        } finally {
            setIsImporting(false);
        }
    };

    const closeImportModal = () => {
        setIsImportModalOpen(false);
        setSelectedFile(null);
        setPreviewData(null);
        setImportResult(null);
    };

    const downloadTemplate = () => {
        const template = [
            {
                'Full Name': 'John Doe',
                'Email': 'john.doe@example.com',
                'Phone': '1234567890',
                'Age': 20,
                'Course': 'Computer Science',
                'Department': 'Tech',
                'Hobbies': 'Music',
                'Gender': 'Male',
                'Address': '123 Main St, City, State',
                'Status': 'Active',
                'Emergency Contact Name': 'Jane Doe',
                'Emergency Contact Phone': '0987654321',
                'Emergency Contact Relation': 'Mother'
            }
        ];

        // Create CSV content
        const headers = Object.keys(template[0]);
        const csvContent = [
            headers.join(','),
            template.map(row => headers.map(header => `"${row[header]}"`).join(',')).join('\n')
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_import_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Export function
    const handleExportStudents = async () => {
        setIsExporting(true);
        try {
            const response = await axios.get('http://localhost:5050/students/excel/export', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    search: searchTerm,
                    course: courseFilter  // Add this line
                },
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Get filename from response headers or use default
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'students_export.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting students:', err);
            alert(err.response?.data?.message || 'Failed to export students');
        } finally {
            setIsExporting(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        const newNotification = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove notification after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        }, 5050);
    };

    const renderNotifications = () => {
        const getNotificationIcon = (type) => {
            switch (type) {
                case 'success':
                    return <CheckCircle className="w-5 h-5 text-green-600" />;
                case 'error':
                    return <XCircle className="w-5 h-5 text-red-600" />;
                case 'warning':
                    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
                case 'info':
                    return <AlertCircle className="w-5 h-5 text-blue-600" />;
                default:
                    return <CheckCircle className="w-5 h-5 text-green-600" />;
            }
        };

        const getNotificationColors = (type) => {
            switch (type) {
                case 'success':
                    return 'bg-green-50 border-green-200 text-green-800';
                case 'error':
                    return 'bg-red-50 border-red-200 text-red-800';
                case 'warning':
                    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                case 'info':
                    return 'bg-blue-50 border-blue-200 text-blue-800';
                default:
                    return 'bg-green-50 border-green-200 text-green-800';
            }
        };

        const removeNotification = (id) => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        };

        if (notifications.length === 0) return null;

        return (
            <div className="fixed top-4 right-2 sm:right-4 z-50 space-y-2 w-[calc(100vw-2rem)] max-w-sm">
                <style>{`
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `}</style>
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getNotificationColors(notification.type)}`}
                        style={{
                            animation: 'slideInRight 0.3s ease-out'
                        }}
                    >
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{notification.message}</p>
                                <p className="text-xs mt-1 opacity-75">
                                    {notification.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="flex-shrink-0 ml-2 hover:opacity-75"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-6 no-horizontal-scroll">

            {renderNotifications()}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <StudentsIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Students Management</h1>
                                <p className="text-gray-600">Manage student records and information</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto">

                            <button
                                onClick={handleExportStudents}
                                disabled={isExporting}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {isExporting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span className="font-medium text-sm">Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        <span className="font-medium text-sm">Export Excel</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <Upload className="w-5 h-5" />
                                <span className="font-medium text-sm">Import Excel</span>
                            </button>
                            <button
                                onClick={openAddModal}
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="font-medium text-sm">Add Student</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">

                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <StudentsIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Current Page</p>
                                    <p className="text-2xl font-bold text-gray-900">{currentPage} of {totalPages}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Filter className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Showing</p>
                                    <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {courseFilter && (
                    <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-6 flex items-center">
                        <Filter className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-800">
                            Showing students for: <span className="font-semibold">{courseFilter}</span>
                            <button
                                onClick={() => handleCourseFilter('')}
                                className="ml-2 text-blue-600 cursor-pointer hover:text-blue-800"
                            >
                                (Clear filter)
                            </button>
                        </span>
                    </div>
                )}

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 mb-6 border border-gray-100">
                    <div className="relative w-full max-w-md mx-auto lg:mx-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students by name, email, phone, or course..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Add this below the search bar */}
                <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2">

                    <button
                        onClick={() => handleCourseFilter('')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${courseFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        All Courses
                    </button>
                    {courses.map(course => (
                        <button
                            key={course}
                            onClick={() => handleCourseFilter(course)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${courseFilter === course ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {course}
                        </button>
                    ))}
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto min-w-0">

                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>Name</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4" />
                                            <span>Email</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4" />
                                            <span>Phone</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Age</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Course</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Briefcase className="w-4 h-4" />
                                            <span>Department</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="w-4 h-4" />
                                            <span>Hobbies</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>Status</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {student.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{student.fullName}</p>
                                                    <p className="text-sm text-gray-500">{student.gender}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{student.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{student.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{student.age}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{student.course}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{student.department}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900">{student.hobbies}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>


                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden">
                        {students.map((student) => (
                            <div key={student._id} className="p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-semibold text-sm">
                                            {student.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 truncate">{student.fullName}</h3>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2 min-w-0">
                                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="truncate min-w-0 break-all text-xs">{student.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{student.phone}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>Age: {student.age}</span>
                                                </div>
                                                <span className="text-gray-500">{student.gender}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">{student.course}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate text-xs">{student.department}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Sparkles className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate text-xs">{student.hobbies}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 px-4 lg:px-6 py-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-600 text-center sm:text-left">
                                Showing <span className="font-semibold">{students.length}</span> of <span className="font-semibold">{totalStudents}</span> students
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                <div className="flex space-x-1">
                                    {[...Array(totalPages)].slice(0, 5).map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === index + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    {totalPages > 5 && <span className="px-2 py-2 text-gray-500">...</span>}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Add/Edit Student Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[calc(100vw-1rem)] sm:max-w-2xl max-h-[95vh] flex flex-col transform transition-all">

                            {/* Modal Header - Fixed */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {isEditMode ? 'Edit Student' : 'Add New Student'}
                                    </h2>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Scrollable Form Content */}
                            <form
                                id="studentForm"
                                onSubmit={handleSubmit}
                                className="flex-1 overflow-auto p-6"
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="Enter full name"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Enter email address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Enter phone number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                placeholder="Enter age"
                                                min="15"
                                                max="100"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                            <select
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            >
                                                <option value="">Select Course</option>
                                                {courses.map(course => (
                                                    <option key={course} value={course}>{course}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {department.map(each => (
                                                    <option key={each} value={each}>{each}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
                                            <select
                                                name="hobbies"
                                                value={formData.hobbies}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            >
                                                <option value="">Select Hobbies</option>
                                                {hobbies.map(each => (
                                                    <option key={each} value={each}>{each}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <textarea
                                            name="address"
                                            placeholder="Enter address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-md font-semibold mb-4 flex items-center space-x-2">
                                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                                            <span>Emergency Contact</span>
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                                                <input
                                                    type="text"
                                                    name="emergencyContact.name"
                                                    placeholder="Enter contact name"
                                                    value={formData.emergencyContact.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    name="emergencyContact.phone"
                                                    placeholder="Enter contact phone"
                                                    value={formData.emergencyContact.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                                                <input
                                                    type="text"
                                                    name="emergencyContact.relation"
                                                    placeholder="Enter relation"
                                                    value={formData.emergencyContact.relation}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            {statuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>

                            {/* Fixed Footer */}
                            <div className="p-6 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        form="studentForm"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
                                    >
                                        {isEditMode ? 'Update Student' : 'Add Student'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Import Excel Modal */}
                {isImportModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[calc(100vw-1rem)] sm:max-w-4xl lg:max-w-6xl max-h-[95vh] flex flex-col transform transition-all">


                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                        <FileSpreadsheet className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Import Students from Excel</h2>
                                </div>
                                <button
                                    onClick={closeImportModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-auto p-6">
                                {!previewData && !importResult && (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start space-x-3">
                                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <h3 className="font-semibold text-blue-900">Before importing</h3>
                                                    <p className="text-blue-700 text-sm mt-1">
                                                        Please ensure your Excel file has the correct column headers. Download the template below for reference.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                onClick={downloadTemplate}
                                                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>Download Template</span>
                                            </button>
                                        </div>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Excel File</h3>
                                            <p className="text-gray-600 mb-4">Upload your Excel file (.xlsx or .xls)</p>
                                            <input
                                                type="file"
                                                accept=".xlsx,.xls"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="excelFileInput"
                                            />
                                            <label
                                                htmlFor="excelFileInput"
                                                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <Upload className="w-4 h-4" />
                                                <span>Select File</span>
                                            </label>
                                            {selectedFile && (
                                                <p className="mt-3 text-sm text-gray-600">
                                                    Selected: {selectedFile.name}
                                                </p>
                                            )}
                                        </div>

                                        {selectedFile && (
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={handlePreviewExcel}
                                                    disabled={isPreviewLoading}
                                                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                                                >
                                                    {isPreviewLoading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Search className="w-4 h-4" />
                                                            <span>Preview Data</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {previewData && !importResult && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-3">
                                                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                                                    <div>
                                                        <p className="text-2xl font-bold text-blue-900">{previewData.totalRows}</p>
                                                        <p className="text-blue-700 text-sm">Total Rows</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-3">
                                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                                    <div>
                                                        <p className="text-2xl font-bold text-green-900">{previewData.validRows}</p>
                                                        <p className="text-green-700 text-sm">Valid Rows</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <div className="flex items-center space-x-3">
                                                    <XCircle className="w-8 h-8 text-red-600" />
                                                    <div>
                                                        <p className="text-2xl font-bold text-red-900">{previewData.invalidRows}</p>
                                                        <p className="text-red-700 text-sm">Invalid Rows</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                            <div className="overflow-x-auto -mx-6 px-6">
                                                <div className="max-h-96 overflow-y-auto">
                                                    <table className="w-full text-sm min-w-[600px]">
                                                        <thead className="bg-gray-50 sticky top-0">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Row</th>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Phone</th>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Course</th>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                                                                <th className="px-4 py-3 text-left font-semibold text-gray-900">Errors</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {previewData.data.map((row, index) => (
                                                                <tr key={index} className={row.errors.length > 0 ? 'bg-red-50' : 'bg-green-50'}>
                                                                    <td className="px-4 py-3">{row.rowNumber}</td>
                                                                    <td className="px-4 py-3">{row.fullName}</td>
                                                                    <td className="px-4 py-3">{row.email}</td>
                                                                    <td className="px-4 py-3">{row.phone}</td>
                                                                    <td className="px-4 py-3">{row.course}</td>
                                                                    <td className="px-4 py-3">
                                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                                                                            {row.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {row.errors.length > 0 ? (
                                                                            <div className="space-y-1">
                                                                                {row.errors.map((error, errorIndex) => (
                                                                                    <span key={errorIndex} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                                                                        {error}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="inline-flex items-center text-green-600">
                                                                                <CheckCircle className="w-4 h-4" />
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => {
                                                    setPreviewData(null);
                                                    setSelectedFile(null);
                                                }}
                                                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                <span>Back</span>
                                            </button>
                                            {previewData.validRows > 0 && (
                                                <button
                                                    onClick={handleImportStudents}
                                                    disabled={isImporting}
                                                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                                                >
                                                    {isImporting ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                            <span>Importing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-4 h-4" />
                                                            <span>Import {previewData.validRows} Students</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {importResult && (
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Import Completed!</h3>
                                            <p className="text-gray-600">Your Excel data has been processed successfully.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                                <p className="text-2xl font-bold text-blue-900">{importResult.totalProcessed}</p>
                                                <p className="text-blue-700 text-sm">Total Processed</p>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                                <p className="text-2xl font-bold text-green-900">{importResult.successfulImports}</p>
                                                <p className="text-green-700 text-sm">Successfully Imported</p>
                                            </div>
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                                <p className="text-2xl font-bold text-yellow-900">{importResult.duplicateEmails}</p>
                                                <p className="text-yellow-700 text-sm">Duplicate Emails</p>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                                <p className="text-2xl font-bold text-red-900">{importResult.errors}</p>
                                                <p className="text-red-700 text-sm">Errors</p>
                                            </div>
                                        </div>

                                        {importResult.details && (
                                            <div className="space-y-4">
                                                {importResult.details.duplicates && importResult.details.duplicates.length > 0 && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                        <h4 className="font-semibold text-yellow-900 mb-2">Duplicate Emails Found:</h4>
                                                        <div className="space-y-1">
                                                            {importResult.details.duplicates.map((duplicate, index) => (
                                                                <p key={index} className="text-yellow-800 text-sm">
                                                                    {duplicate.fullName} - {duplicate.email}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {importResult.details.errors && importResult.details.errors.length > 0 && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                        <h4 className="font-semibold text-red-900 mb-2">Import Errors:</h4>
                                                        <div className="space-y-1">
                                                            {importResult.details.errors.map((error, index) => (
                                                                <p key={index} className="text-red-800 text-sm">
                                                                    Row {error.index + 1}: {error.error}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex justify-center">
                                            <button
                                                onClick={closeImportModal}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Students;