<template>
    <Toast></Toast>
    <div class="card">
        <DataTable 
            ref="dt"
            v-model:editingRows="editingRows" 
            :value="courses" 
            editMode="row" 
            dataKey="courseId" 
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
            <Column field="courseId" header="课程编号" style="width: 45%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="courseName" header="课程名称" style="width: 45%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 6rem" bodyStyle="text-align:center" />
            <Column bodyStyle="text-align:center" style="width: 10%; min-width: 8rem">
                <template #body="{ data }">
                    <Button size="small" icon="pi pi-trash" severity="danger" @click="onDelete(data)"/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCourseList, updateCourse, deleteCourse } from '../api/api.js';
import { useToast } from 'primevue';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const toast = useToast();
const courses = ref([]);
const editingRows = ref([]);
const dt = ref();
const loading = ref(false);

const exportCSV = () => {
    dt.value.exportCSV();
};

const loadData = async () => {
    loading.value = true;
    try {
        const res = await getCourseList();
        courses.value = res.data?.data || [];
    } catch (error) {
        console.error('获取课程列表失败:', error);
        console.error('数据加载失败: ' + (error.response?.data?.msg || error.message));
        toast.add({ severity: 'error', summary: 'Error', detail: '数据加载失败', life: 2000 });
        courses.value = [];
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
    const { newData, index } = event;
    try {
        await updateCourse(newData.courseId, newData);
        courses.value[index] = newData;
    } catch (error) {
        console.error('更新失败: ' + (error.response?.data?.msg || error.message));
        toast.add({ severity: 'error', summary: 'Error', detail: '更新失败', life: 2000 });
        await loadData();
    }
};

const onDelete = async (courseData) => {
    if (confirm(`确定要删除课程 ${courseData.courseName} (编号: ${courseData.courseId}) 吗？`)) {
        try {
            await deleteCourse(courseData.courseId);
            toast.add({ severity: 'success', summary: 'Success', detail: '删除成功', life: 2000 });
            courses.value = courses.value.filter(c => c.courseId !== courseData.courseId);
        } catch (error) {
            console.error('删除失败: ' + (error.response?.data?.msg || error.message));
            toast.add({ severity: 'error', summary: 'Error', detail: '删除失败', life: 2000 });
        }
    }
};
</script>