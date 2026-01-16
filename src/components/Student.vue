<template>
    <Toast></Toast>
    <div class="card">
        <DataTable 
            ref="dt"
            v-model:editingRows="editingRows" 
            :value="students" 
            editMode="row" 
            dataKey="studentId" 
            @row-edit-save="onRowEditSave"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            tableStyle="min-width: 50rem"
            :pt="{ column: { bodycell: ({ state }) => ({ style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem' }) } }"
        >
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="refreshData" :loading="loading" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-download" text @click="exportCSV"/>
            </template>
            <Column field="studentId" header="学号" style="width: 14%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="studentName" header="姓名" style="width: 14%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="studentGender" header="性别" style="width: 14%">
                <template #editor="{ data, field }"><Select v-model="data[field]" :options="genders" optionLabel="label" optionValue="value" placeholder="选择性别" fluid /></template>
                <template #body="{ data }">{{ data.studentGender === 'M' ? '男' : data.studentGender === 'F' ? '女' : data.studentGender }}</template>
            </Column>
            <Column field="studentBirthday" header="生日" style="width: 18%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="studentPhone" header="手机号" style="width: 18%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="studentEmail" header="邮箱" style="width: 14%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="studentMajor" header="专业" style="width: 14%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column :rowEditor="true" bodyStyle="text-align:center"></Column>
            <Column bodyStyle="text-align:center">
                <template #body="{ data }">
                    <Button size="small" icon="pi pi-trash" severity="danger" @click="onDelete(data)"/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getStudentList, updateStudent, deleteStudent} from '../api/api.js';
import { useToast } from 'primevue';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

const students = ref([]);
const editingRows = ref([]);
const dt = ref();
const loading = ref(false);
const genders = ref([
    { label: '男', value: 'M' },
    { label: '女', value: 'F' }
]);
const toast = useToast();

const exportCSV = () => {
    dt.value.exportCSV();
};

const loadData = async () => {
    loading.value = true;
    try {
        const res = await getStudentList();
        students.value = res.data?.data || [];
    } catch (error) {
        console.error('获取学生列表失败:', error);
        console.error('数据加载失败: ' + (error.response?.data?.msg || error.message));
        toast.add({ severity: 'error', summary: 'Error', detail: '数据加载失败', life: 2000 });
        students.value = [];
    } finally {
        loading.value = false;
    }
};

const refreshData = async () => {
    await loadData();
    toast.add({ severity: 'success', summary: 'Success', detail: '刷新成功', life: 2000 });
};

onMounted(() => {
    loadData();
});

const onRowEditSave = async (event) => {
    const { data, newData, index } = event;
    try {
        await updateStudent(data.studentId, newData);
        students.value[index] = newData;
    } catch (error) {
        console.error('更新失败: ' + (error.response?.data?.msg || error.message));
        toast.add({ severity: 'error', summary: 'Error', detail: '更新失败', life: 2000 });
        await loadData();
    }
};

const onDelete = async (studentData) => {
    if (confirm(`确定要删除学生 ${studentData.studentName} (学号: ${studentData.studentId}) 吗？`)) {
        try {
            await deleteStudent(studentData.studentId);
            toast.add({ severity: 'success', summary: 'Success', detail: '删除成功', life: 2000 });
            students.value = students.value.filter(s => s.studentId !== studentData.studentId);
        } catch (error) {
            console.error('删除失败: ' + (error.response?.data?.msg || error.message));
            toast.add({ severity: 'error', summary: 'Error', detail: '删除失败', life: 2000 });
        }
    }
};
</script>