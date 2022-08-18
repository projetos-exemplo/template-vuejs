<template>
  <div>
    <h2 class="content-block">Clientes</h2>
    <DxDataGrid
      class="dx-card wide-card"
      :data-source="clientesStore" 
      :show-borders="true" 
      :show-column-lines="true"
      :column-auto-width="true"
      :column-hiding-enabled="true"
      :row-alternation-enabled="true"
      ref="gridClientes"
    >
      <DxLoadPanel :enabled="true" />
      <DxPaging :page-size="10" />
      <DxPager :show-page-size-selector="true" :show-info="true" />
      <DxFilterRow :visible="true" />
      <DxEditing
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        refresh-mode="reshape"
        mode="popup"
      >
        <DxPopup
          :show-title="true" 
          :height="isLargeScreen ? 350 : 'auto'"
          title="Dados do Cliente"
        > 
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
        <DxForm>
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
                value: false,
              }"
            >    
              <DxRequiredRule message="Selecione um item." />
              <DxValidator>
                <DxCompareRule
                  :comparison-target="(e) => e.target.value === null"
                  message="You must agree to the Terms and Conditions"
                />
              </DxValidator>
              <DxLabel :visible="false" />
            </DxItem>
          </DxItem> 
        </DxForm>
      </DxEditing>

      <DxColumn data-field="id" :width="90" :hiding-priority="2" />

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
        :hiding-priority="5"
      > 
      </DxColumn>  

      <DxColumn
        data-field="indAtivo"
        caption="Ativo" 
        :hiding-priority="1"
      /> 
    </DxDataGrid> 
  </div> 
</template>

<script>
import { ref } from 'vue';  
import { sizes } from '../utils/media-query';
import CustomStore from 'devextreme/data/custom_store';
import "devextreme/data/odata/store";
import DxDataGrid, {
  DxColumn,
  DxFilterRow, 
  DxEditing,
  DxPopup, 
  DxToolbarItem,
  DxForm,
  DxItem,
  DxPager,
  DxPaging,
  DxLoadPanel,
  DxRequiredRule,
  DxLabel,
} from "devextreme-vue/data-grid";
import api from '@/services/api';
import endpoints from '@/endpoints';

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
    const isLargeScreen = sizes()['screen-large'];

    const gridClientes = ref(null); 
    const token = localStorage.getItem('token'); 

    const clientesStore = new CustomStore({
      key: 'id',
      load: () => buscarClientes(),
      insert: (values) => console.log(values),
      update: (key, values) => console.log(key,values),
      remove: (key) => console.log(key),
    }); 

    const saveButtonOptions = {
      text: "Salvar",
      icon: "save", 
      stylingMode: "contained",
      onClick: () => {   
        gridClientes.value.instance.saveEditData();
      }
    };

    const cancelButtonOptions = {
      text: "Cancelar", 
      stylingMode: "contained",
      onClick: e => {
        console.log(e); 
        gridClientes.value.instance.cancelEditData();
      }
    };

    const buscarClientes = async () => {
      const response = await api.get(endpoints.BUSCAR_CLIENTES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    }       
    return { 
      isLargeScreen,
      gridClientes,
      clientesStore,
      saveButtonOptions,
      cancelButtonOptions,
      indicatorAtivo,
    };
  },   
  components: {
    DxDataGrid,
    DxColumn,
    DxFilterRow,
    DxEditing, 
    DxPopup, 
    DxToolbarItem,
    DxForm,
    DxItem,
    DxPager,
    DxPaging,
    DxLoadPanel,
    DxRequiredRule,
    DxLabel
  }
};
</script>
