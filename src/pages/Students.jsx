import { useEffect, useState } from 'react';
import axios from 'axios';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        course: '',
        gender: '',
        address: '',
        emergencyContact: {
            name: '',
            phone: '',
            relation: ''
        },
        status: 'Active'
    });

    // added
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalStudents, setTotalStudents] = useState(0);
    // added

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
    ]

    const hobbies = [
        'Music',
        'Dancing',
        'Painting',
        'Traveling']

    const statuses = ['Active', 'Inactive', 'Graduated', 'Dropped'];

    useEffect(() => {
        fetchStudents();
    }, [token]);

    // const fetchStudents = async () => {
    //     try {
    //         const res = await axios.get('http://localhost:5000/students', {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         setStudents(res.data);
    //     } catch (err) {
    //         if (err.response?.status === 401) {
    //             localStorage.removeItem('userData');
    //             localStorage.removeItem('token');
    //             window.location.href = '/';
    //         }
    //     }
    // };

    const fetchStudents = async (page = 1, search = '') => {
        try {
            const res = await axios.get(`http://localhost:5000/students?page=${page}&limit=7&search=${search}`, {
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
                // Update student
                const res = await axios.put(`http://localhost:5000/students/${editingStudentId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(students.map(student =>
                    student._id === editingStudentId ? res.data.student : student
                ));
            } else {
                // Add new student
                const res = await axios.post('http://localhost:5000/students', formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents([res.data.student, ...students]);
            }
            closeModal();
        } catch (err) {
            console.error('Error submitting form:', err);
            alert(err.response?.data?.message || 'An error occurred');
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
            gender: student.gender,
            address: student.address,
            emergencyContact: student.emergencyContact || { name: '', phone: '', relation: '' },
            status: student.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`http://localhost:5000/students/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(students.filter(student => student._id !== studentId));
            } catch (err) {
                console.error('Error deleting student:', err);
                alert(err.response?.data?.message || 'Failed to delete student');
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
        fetchStudents(1, value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchStudents(page, searchTerm);
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Students</h1>
                <button
                    onClick={openAddModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Add Student
                </button>
            </div>

            <input
                type="text"
                placeholder="Search students by name, email, phone, or course..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full max-w-md mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            {/* Students Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Phone</th>
                            <th className="border px-4 py-2">Age</th>
                            <th className="border px-4 py-2">Course</th>
                            <th className="border px-4 py-2">Department</th>
                            <th className="border px-4 py-2">Hobbies</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td className="border px-4 py-2">{student.fullName}</td>
                                <td className="border px-4 py-2">{student.email}</td>
                                <td className="border px-4 py-2">{student.phone}</td>
                                <td className="border px-4 py-2">{student.age}</td>
                                <td className="border px-4 py-2">{student.course}</td>
                                <td className="border px-4 py-2">{student.department}</td>
                                <td className="border px-4 py-2">{student.hobbies}</td>
                                <td className="border px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-sm ${student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        student.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                            student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="border px-4 py-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(student)}
                                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                    Showing {students.length} of {totalStudents} students
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            </div>


            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {isEditMode ? 'Edit Student' : 'Add New Student'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="Age"
                                    min="15"
                                    max="100"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select department</option>
                                    {department.map(each => (
                                        <option key={each} value={each}>{each}</option>
                                    ))}
                                </select>
                                <select
                                    name="hobbies"
                                    value={formData.hobbies}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select hobbies</option>
                                    {hobbies.map(each => (
                                        <option key={each} value={each}>{each}</option>
                                    ))}
                                </select>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <textarea
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <div className="border-t pt-4">
                                <h3 className="text-md font-semibold mb-2">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        name="emergencyContact.name"
                                        placeholder="Contact Name"
                                        value={formData.emergencyContact.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="tel"
                                        name="emergencyContact.phone"
                                        placeholder="Contact Phone"
                                        value={formData.emergencyContact.phone}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        name="emergencyContact.relation"
                                        placeholder="Relation"
                                        value={formData.emergencyContact.relation}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    {isEditMode ? 'Update Student' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;