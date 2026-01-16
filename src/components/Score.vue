<template>
    <Toast></Toast>
    <div class="card">
        <DataTable 
            ref="dt"
            v-model:editingRows="editingRows" 
            :value="scores" 
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
            <Column field="studentId" header="学号" style="width: 28%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="courseId" header="课程编号" style="width: 28%">
                <template #editor="{ data, field }"><InputText v-model="data[field]" fluid /></template>
            </Column>
            <Column field="score" header="成绩" style="width: 28%">
                <template #editor="{ data, field }"><InputNumber v-model="data[field]" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" fluid /></template>
            </Column>
            <Column :rowEditor="true" style="width: 8%; min-width: 6rem" bodyStyle="text-align:center" />
            <Column bodyStyle="text-align:center" style="width: 8%; min-width: 6rem">
                <template #body="{ data }">
                    <Button size="small" icon="pi pi-trash" severity="danger" @click="onDelete(data)"/>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getScoreList, updateScore, deleteScore } from '../api/api.js';
import { useToast } from 'primevue';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';

const scores = ref([]);
const editingRows = ref([]);
const dt = ref();
const loading = ref(false);
const toast = useToast();

const exportCSV = () => {
    dt.value.exportCSV();
};

const loadData = async () => {
    loading.value = true;
    try {
        const res = await getScoreList();
        scores.value = res.data?.data || [];
    } catch (error) {
        console.error('获取成绩列表失败:', error);
        console.error('数据加载失败: ' + (error.response?.data?.msg || error.message));
        toast.add({ severity: 'error', summary: 'Error', detail: '数据加载失败', life: 2000 });
        scores.value = [];
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
        await updateScore(newData.studentId, newData.courseId, newData);
        scores.value[index] = newData;
    } catch (error) {
        console.error('更新失败: ' + (error.response?.data?.msg || error.message));
        toast.add({ severity: 'error', summary: 'Error', detail: '更新失败', life: 2000 });
        const res = await getScoreList();
        scores.value = res.data?.data || [];
    }
};

const onDelete = async (scoreData) => {
    if (confirm(`确定要删除成绩 学号:${scoreData.studentId} 课程:${scoreData.courseId}吗？`)) {
        try {
            await deleteScore(scoreData.studentId, scoreData.courseId);
            toast.add({ severity: 'success', summary: 'Success', detail: '删除成功', life: 2000 });
            scores.value = scores.value.filter(s => !(s.studentId === scoreData.studentId && s.courseId === scoreData.courseId));
            console.log('删除成功:', scoreData.studentId, scoreData.courseId);
        } catch (error) {
            console.error('删除成绩失败:', error);
            console.error('删除失败: ' + (error.response?.data?.msg || error.message));
            toast.add({ severity: 'error', summary: 'Error', detail: '删除失败', life: 2000 });
        }
    }
};
</script>