import axios from 'axios';

const request = axios.create({
    baseURL:"http://127.0.0.1:8080",
    timeout:20000
})

export const getStudentList = () => {
    return request({
        url: '/api/student/',
        method: 'GET',
    });
};

export const updateStudent = (studentId, studentData) => {
    return request({
        url: `/api/student/${studentId}`,
        method: 'PUT',
        data: studentData
    });
};