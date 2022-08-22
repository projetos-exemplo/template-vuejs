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
      <DxToolbar> 
        <DxItem 
          location="after"
          widget="dxButton"
          :options="addButtonOptions"
        />
      </DxToolbar>
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
      <DxForm ref="formCliente" :form-data="dadosCliente" :disabled="isLoading">
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
              mask: '00.000.000/0000-00',
              maskInvalidMessage: 'Preencha o CNPJ.'
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
              readOnly: !isNew,
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
      </DxForm> 
      <DxToolbarItem
        toolbar="bottom"
        location="after"
        widget="dxButton"
        :options="saveButtonOptions"
      />
      <DxToolbarItem
        toolbar="bottom"
        location="after"
        widget="dxButton"
        :options="cancelButtonOptions"
      />
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
import { validarCNPJ } from '@/utils/validators';

import DxDataGrid, { 
  DxToolbar,
  DxColumn,
  DxButton
} from 'devextreme-vue/data-grid';

import { DxPopup, DxToolbarItem } from 'devextreme-vue/popup';
import DxForm, {
  DxItem,  
  DxLabel, 
  DxRequiredRule, 
} from "devextreme-vue/form";  

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
    const formCliente = ref(null);
    const dadosCliente = ref(null);
    const isNew = ref(null);

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

    const exibirPopupAdicionarCliente = () => {
      exibirPopup.value = true;
      tituloPopup.value = 'Novo Cliente';
      dadosCliente.value = Object.assign({}, {});
      dadosCliente.value.indAtivo = false;
      isNew.value = true;
    }

    const exibirPopupEditarCliente = (e) => {
      exibirPopup.value = true;
      tituloPopup.value = 'Editar Cliente';
      dadosCliente.value = Object.assign({}, e.row.data); 
      isNew.value = false;
    } 

    const addButtonOptions = {
      hint: "Novo cliente",
      icon: "plus",   
      onClick: () => exibirPopupAdicionarCliente()
    };

    const saveButtonOptions = {
      text: "Salvar",
      icon: "save", 
      type: "default",
      stylingMode: "contained",
      onClick: () => handleSalvarCliente()
    };
    
    const cancelButtonOptions = {
      text: "Cancelar", 
      stylingMode: "contained",
      type: "normal",
      elementAttr: {
        class: "dx-button-cancel"
      },
      onClick: () => { 
        exibirPopup.value = false;
      }
    };

    const handleSalvarCliente = () => { 
      isNew.value ? cadastrarCliente() : atualizarCliente(); 
    } 

    const handleCancelar = () => {
      exibirPopup.value = false;
    }

    const cadastrarCliente = async () => { 
      const formIsValid = formCliente.value.instance.validate().isValid; 
      if (formIsValid) {
        const isValidCnpj = validarCNPJ(dadosCliente.value.cnpj); 
        if (!isValidCnpj) {
          customNotify("O CNPJ informado é inválido", "warning"); 
          return;
        }
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
    }

    const atualizarCliente = async () => {
      const formIsValid = formCliente.value.instance.validate().isValid; 
      if (formIsValid) {
        const isValidCnpj = validarCNPJ(dadosCliente.value.cnpj); 
        if (!isValidCnpj) {
          customNotify("O CNPJ informado é inválido", "warning"); 
          return;
        }
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
    }

    return {
      isLargeScreen,
      isLoading,
      gridClientes,
      dataSourceClientes,
      exibirPopup,
      tituloPopup,
      formCliente,
      dadosCliente,
      isNew,
      exibirPopupEditarCliente, 
      indicatorAtivo,
      handleSalvarCliente,
      handleCancelar, 
      addButtonOptions,
      saveButtonOptions,
      cancelButtonOptions
    };
  },   
  components: { 
    DxDataGrid,
    DxToolbar,
    DxColumn,
    DxButton,
    DxPopup, 
    DxToolbarItem,
    DxForm,
    DxItem,
    DxLabel,
    DxRequiredRule
  }
};

</script>
