<template>
    <div class="card">
        <DataTable 
            v-model:editingRows="editingRows" 
            :value="students" 
            editMode="row" 
            dataKey="studentId" 
            @row-edit-save="onRowEditSave"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            :pt="{
                column: {
                    bodycell: ({ state }) => ({
                        style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem'
                    })
                }
            }"
        >
            <Column field="studentId" header="学号" style="width: 14%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="studentName" header="姓名" style="width: 14%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="studentGender" header="性别" style="width: 14%">
                <template #editor="{ data, field }">
                    <Select v-model="data[field]" :options="genders" optionLabel="label" optionValue="value" placeholder="选择性别" fluid />
                </template>
                <template #body="{ data }">
                    {{ data.studentGender === 'M' ? '男' : data.studentGender === 'F' ? '女' : data.studentGender }}
                </template>
            </Column>
            <Column field="studentBirthday" header="生日" style="width: 18%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="studentPhone" header="手机号" style="width: 18%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="studentEmail" header="邮箱" style="width: 14%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="studentMajor" header="专业" style="width: 14%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getStudentList, updateStudent } from '../api/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

const students = ref([]);
const editingRows = ref([]);
const genders = ref([
    { label: '男', value: 'M' },
    { label: '女', value: 'F' }
]);

onMounted(async () => {
    try {
        const res = await getStudentList();
        students.value = res.data?.data || [];
    } catch (error) {
        console.error('获取学生列表失败:', error);
        students.value = [];
    }
});

const onRowEditSave = async (event) => {
    const { newData, index } = event;
    try {
        await updateStudent(newData.studentId, newData);
        students.value[index] = newData;
        console.log('更新成功:', newData);
    } catch (error) {
        console.error('更新学生信息失败:', error);
        alert('更新失败: ' + (error.response?.data?.msg || error.message));

        const res = await getStudentList();
        students.value = res.data?.data || [];
    }
};
</script>