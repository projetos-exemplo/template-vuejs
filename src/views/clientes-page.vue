<template>
  <div>
    <h2 class="content-block">Clientes</h2>
    <DxDataGrid
    ref="gridClientes"
    :data-source="dataSourceClientes"
    :remote-operations="false"
    :allow-column-reordering="true"
    :row-alternation-enabled="true"
    :show-borders="true" 
    >
      <DxColumn
        data-field="id"
        caption="Id"
        data-type="number"   
        :visible="false"
      />
      <DxColumn
        data-field="nome"
        caption="Nome"     
        :hiding-priority="8"
      />
      <DxColumn
        data-field="cnpj"
        caption="CNPJ"    
        :hiding-priority="6"
      />
      <DxColumn
        data-field="schema"
        caption="Schema"   
        :width="90" 
        :hiding-priority="5"
      />
      <DxColumn
        data-field="indAtivo"
        caption="Ativo"  
        :width="90" 
        :hiding-priority="1" 
        :calculate-cell-value="(rowData) => { 
          return rowData.indAtivo ? 'Sim' : 'Não'
        }"
      /> 
      <DxColumn 
        type="buttons"
        alignment="center"
        caption="Ações" 
        :width="110" 
      > 
        <DxButton
          hint="Editar"
          icon="edit" 
          @click="exibirPopupEditarCliente"
        />
      </DxColumn>
      <DxColumn
        data-field="url"
        caption="url"
        :visible="false"
      />
      <DxColumn
        data-field="urlLogo"
        caption="urlLogo"
        :visible="false"
      />  
    </DxDataGrid>

    <DxPopup
      v-model:visible="exibirPopup"
      :show-title="true" 
      :show-close-button="true"
      :title="tituloPopup"
      :height="isLargeScreen ? 550 : 'auto'"
    >
      <form class="form" @submit.prevent="handleSalvarCliente">
        <DxForm :form-data="dadosCliente" :disabled="isLoading">
          <DxItem
            :col-count="1"
            :col-span="2"
            item-type="group"
          >
            <DxItem 
              data-field="nome"
              editor-type='dxTextBox'
              :editor-options="{ 
                stylingMode: 'outlined', 
                labelMode: 'floating', 
                placeholder: 'Nome'
              }"
            > 
              <DxRequiredRule message="Preencha o Nome." />
              <DxLabel :visible="false" />
            </DxItem>
          </DxItem>  
          <DxItem
            :col-count="1"
            :col-span="2"
            item-type="group"
          > 
            <DxItem 
              data-field="cnpj" 
              editor-type='dxTextBox'
              :editor-options="{ 
                stylingMode: 'outlined', 
                labelMode: 'floating', 
                placeholder: 'CNPJ',
                mask: '00.000.000/0000-00'
              }"
            >
              <DxRequiredRule message="Preencha o CNPJ." />
              <DxLabel :visible="false" />
            </DxItem>
          </DxItem>
          <DxItem
            :col-count="2"
            :col-span="2"
            item-type="group"
          >
            <DxItem 
              data-field='schema'
              editor-type='dxTextBox'
              :editor-options="{ 
                stylingMode: 'outlined', 
                labelMode: 'floating', 
                placeholder: 'Schema', 
              }"
            >
              <DxRequiredRule message="Preencha o Schema." />
              <DxLabel :visible="false" />
            </DxItem>
            <DxItem 
              data-field='indAtivo'
              editor-type='dxSelectBox'   
              :editor-options="{  
                stylingMode: 'outlined',  
                labelMode: 'floating', 
                placeholder: 'Ativo',
                dataSource: indicatorAtivo,
                displayExpr: 'description',
                valueExpr: 'value', 
              }"
            >  
              <DxCompareRule comparison-type="!==" :comparison-target="() => { return undefined}" message="Teste"/>
              <DxLabel :visible="false" />
            </DxItem>
          </DxItem> 
          <DxItem
            :col-count="1"
            :col-span="2"
            item-type="group"
          >
            <DxItem 
              data-field="url"
              editor-type='dxTextBox'
              :editor-options="{ 
                stylingMode: 'outlined', 
                labelMode: 'floating', 
                placeholder: 'URL'
              }"
            > 
              <DxRequiredRule message="Preencha a Url." />
              <DxLabel :visible="false" />
            </DxItem>
          </DxItem> 
          <DxItem
            :col-count="1"
            :col-span="2"
            item-type="group"
          >
            <DxItem 
              data-field="urlLogo"
              editor-type='dxTextBox'
              :editor-options="{ 
                stylingMode: 'outlined', 
                labelMode: 'floating', 
                placeholder: 'URL Logo'
              }"
            > 
              <DxRequiredRule message="Preencha o URL da Logo." />
              <DxLabel :visible="false" />
            </DxItem>
          </DxItem>
          <DxItem
            :col-count="2"
            :col-span="2"
            item-type="group"
          >
            <DxButtonItem>
              <DxButtonOptions
                width="100%"
                type="default"
                template="btnSalvarTemplate"
                :use-submit-behavior="true"
              >
              </DxButtonOptions>
            </DxButtonItem>
            <DxButtonItem>
              <DxButtonOptions
                width="100%"
                type="default"
                template="btnCancelarTemplate"
                @click="handleCancelar"
              >
              </DxButtonOptions>
            </DxButtonItem>
          </DxItem> 
          <template #btnSalvarTemplate>
            <div>
              <span class="dx-button-text">
                <DxLoadIndicator v-if="isLoading" width="24px" height="24px" :visible="true" />
                <span v-if="!isLoading">Salvar</span>
              </span>
            </div>
          </template>
          <template #btnCancelarTemplate>
            <div>
              <span class="dx-button-text"> 
                <span>Cancelar</span>
              </span>
            </div>
          </template>
        </DxForm> 
      </form>
    </DxPopup>
  </div> 
</template>

<script>  
import { ref } from 'vue';  
import { useRouter } from 'vue-router';
import { api, validateApiError }  from '@/services/api';
import endpoints from '@/endpoints';  
import { sizes } from '../utils/media-query';
import customNotify from '@/utils/custom-notify'; 

import DxDataGrid, { 
  DxColumn,
  DxButton
} from 'devextreme-vue/data-grid';

import { DxPopup } from 'devextreme-vue/popup';
import DxForm, {
  DxItem,  
  DxLabel, 
  DxRequiredRule,
  DxCompareRule,
  DxButtonItem,
  DxButtonOptions
} from "devextreme-vue/form";

import DxLoadIndicator from "devextreme-vue/load-indicator";

const indicatorAtivo = [
  {
    value: true, 
    description: 'Sim'
  },
  {
    value: false,
    description: 'Não'
  },
]; 

export default { 
  setup() {  
    const router = useRouter(); 
    const token = localStorage.getItem('token');  
    const isLargeScreen = sizes()['screen-large']; 
    const isLoading = ref(false);
    
    const gridClientes = ref(null); 
    const dataSourceClientes = ref([]); 
    
    const exibirPopup = ref(null);
    const tituloPopup = ref(null);
    const dadosCliente = ref(null);

    const buscarClientes = async () => {  
      try { 
        const response = await api.get(endpoints.CLIENTES, {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        dataSourceClientes.value = response.data;
      } catch (err) {
        validateApiError(err, router); 
      }
    }  

    buscarClientes();

    const exibirPopupEditarCliente = (e) => {
      exibirPopup.value = true;
      tituloPopup.value = 'Editar Cliente';
      dadosCliente.value = e.row.data; 
    }

    // const saveButtonOptions = {
    //   text: "Salvar",
    //   icon: "save", 
    //   stylingMode: "contained",
    //   onClick: () => {     
    //     dadosCliente.value.id ? atualizarCliente() : cadastrarCliente(); 
    //   }
    // };
    
    // const cancelButtonOptions = {
    //   text: "Cancelar", 
    //   stylingMode: "contained",
    //   onClick: () => { 
    //     exibirPopup.value = false;
    //   }
    // };

    const handleSalvarCliente = () => {
      dadosCliente.value.id ? atualizarCliente() : cadastrarCliente(); 
    } 

    const handleCancelar = () => {
      exibirPopup.value = false;
    }

    const cadastrarCliente = async () => { 
      const data = dadosCliente.value;
      try { 
        const response = await api.post(endpoints.CLIENTES, data, {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        customNotify(response.data.message, "success"); 
      } catch (err) {  
        validateApiError(err, router);
      } finally {
        exibirPopup.value = false;
        buscarClientes();
      }
    }

    const atualizarCliente = async () => {
      const data = dadosCliente.value;
      try { 
        const response = await api.put(endpoints.CLIENTES, data, {
          headers: { Authorization: `Bearer ${token}` }
        }); 
        customNotify(response.data.message, "success");  
      } catch (err) { 
        validateApiError(err, router);
      } finally {
        exibirPopup.value = false;
        buscarClientes();
      }
    }

    return {
      isLargeScreen,
      isLoading,
      gridClientes,
      dataSourceClientes,
      exibirPopup,
      tituloPopup,
      dadosCliente,
      exibirPopupEditarCliente,
      indicatorAtivo,
      handleSalvarCliente,
      handleCancelar
    };
  },   
  components: { 
    DxDataGrid,
    DxColumn,
    DxButton,
    DxPopup, 
    DxForm,
    DxItem,
    DxLabel,
    DxRequiredRule,
    DxCompareRule,
    DxButtonItem,
    DxButtonOptions,
    DxLoadIndicator
  }
};

</script>
