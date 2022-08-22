<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <DxForm :form-data="formData" :disabled="loading">
      <DxItem
        data-field="email"
        editor-type="dxTextBox"
        :editor-options="{ stylingMode: 'outlined', labelMode: 'floating', placeholder: 'Email', mode: 'email' }"
      >
        <DxRequiredRule message="Preencha o email." />
        <DxEmailRule message="O email informado é inválido." />
        <DxLabel :visible="false" />
      </DxItem>
      <DxItem
        data-field='senha'
        editor-type='dxTextBox'
        :editor-options="{ stylingMode: 'outlined', labelMode: 'floating', placeholder: 'Senha', mode: 'password' }"
      >
        <DxRequiredRule message="Preencha a senha." />
        <DxLabel :visible="false" />
      </DxItem>
      <DxButtonItem>
        <DxButtonOptions
          width="100%"
          type="default"
          template="signInTemplate"
          :use-submit-behavior="true"
        >
        </DxButtonOptions>
      </DxButtonItem>
      <DxItem>
        <template #default>
          <div class="link">
            <router-link to="/reset-password">Esqueceu a senha?</router-link>
          </div>
        </template>
      </DxItem>
      <template #signInTemplate>
        <div>
          <span class="dx-button-text">
            <DxLoadIndicator v-if="loading" width="24px" height="24px" :visible="true" />
            <span v-if="!loading">Entrar</span>
          </span>
        </div>
      </template>
    </DxForm>
  </form>
</template>

<script>
import DxLoadIndicator from "devextreme-vue/load-indicator";
import DxForm, {
  DxItem,
  DxEmailRule,
  DxRequiredRule,
  DxLabel,
  DxButtonItem,
  DxButtonOptions
} from "devextreme-vue/form";
import notify from 'devextreme/ui/notify';

import auth from "../services/auth";

import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const formData = reactive({
      email: "",
      senha: ""
    });
    const loading = ref(false);

    function onCreateAccountClick() {
      router.push("/create-account");
    }

    async function onSubmit() {
      const { email, senha } = formData;
      loading.value = true;
      const result = await auth.login(email, senha);
      if (!result.isOk) {
        loading.value = false;
        notify(result.message, "error", 2000);
      } else {
        router.push(route.query.redirect || "/home");
      }
    }

    return {
      formData,
      loading,
      onCreateAccountClick,
      onSubmit
    };
  },
  components: {
    DxLoadIndicator,
    DxForm,
    DxEmailRule,
    DxRequiredRule,
    DxItem,
    DxLabel,
    DxButtonItem,
    DxButtonOptions
  }
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";

.login-form {
  .link {
    text-align: center;
    font-size: 16px;
    font-style: normal;

    a {
      text-decoration: none;
    }
  }

  .form-text {
    margin: 10px 0;
    color: rgba($base-text-color, alpha($base-text-color) * 0.7);
  }
}
</style>
