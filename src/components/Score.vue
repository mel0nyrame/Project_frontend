<template>
    <div class="card">
        <DataTable 
            v-model:editingRows="editingRows" 
            :value="scores" 
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
            <Column field="studentId" header="学号" style="width: 30%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="courseId" header="课程编号" style="width: 30%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" fluid />
                </template>
            </Column>
            <Column field="score" header="成绩" style="width: 30%">
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" fluid />
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getScoreList, updateScore } from '../api/api.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';

const scores = ref([]);
const editingRows = ref([]);

onMounted(async () => {
    try {
        const res = await getScoreList();
        scores.value = res.data?.data || [];
    } catch (error) {
        console.error('获取成绩列表失败:', error);
        scores.value = [];
    }
});

const onRowEditSave = async (event) => {
    const { newData, index } = event;
    try {
        await updateScore(newData.studentId, newData.courseId, newData);
        scores.value[index] = newData;
        console.log('更新成功:', newData);
    } catch (error) {
        console.error('更新成绩失败:', error);
        alert('更新失败: ' + (error.response?.data?.msg || error.message));
        
        const res = await getScoreList();
        scores.value = res.data?.data || [];
    }
};
</script>