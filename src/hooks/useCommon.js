import { type } from "windicss/utils";

class MyClass {
  constructor(obj) {
    // 遍历对象的属性
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 将对象的属性名和属性值作为 class 的属性
        this[key] = obj[key];
      }
    }
  }
}
export function useInitTable(option = {}) {
  const tableData = ref([]); //数据列表

  const loading = ref(false); //loading动画
  const formRef = ref(null); //表单ref
  const selectedId = ref(0); //选中的id
  const formDrawerRef = ref(null); //表单抽屉ref
  const form = reactive(new MyClass(option.InitFormData)); //表单数据
  // 分页
  const currentPage = ref(1); //当前页码
  const limit = ref(10); //一页多少数据
  const totalCount = ref(0); //总数据条数

  //   获取数据
  const getData = (page = 1, keyword = "", limit = 10) => {
    //删除属性为空的属性
    if (typeof keyword === "object") {
      Object.keys(keyword).forEach((key) => {
        if (
          keyword[key] === null ||
          keyword[key] === "" ||
          keyword[key] === undefined
        ) {
          delete keyword[key];
        }
      });
    }
    loading.value = true;
    currentPage.value = page;
    option
      .getList(page, keyword, limit)
      .then((res) => {
        option.success(res);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 新增按钮
  const addBtn = () => {
    selectedId.value = 0;
    // 重置表单数据
    Object.assign(form, new MyClass(option.InitFormData));
    formDrawerRef.value.drawerswitch();
  };

  //删除数据
  const handleDelete = (id) => {
    option.deleteFun(id).then((res) => {
      ElNotification({
        message: "删除成功",
        type: "success",
      });
      getData();
    });
  };

  //修改数据
  const handleEdit = (item) => {
    selectedId.value = item.id;
    // 给from赋值
    for (let key in item) {
      if (form.hasOwnProperty(key)) {
        form[key] = item[key];
      }
    }
    formDrawerRef.value.drawerswitch();
  };

  // 提交表单
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return false;
      let fun = selectedId.value
        ? option.updateData(selectedId.value, form)
        : option.addData(form);
      fun.then((res) => {
        ElNotification({
          message: selectedId.value ? "修改成功" : "新增成功",
          type: "success",
        });
        getData();
        formDrawerRef.value.drawerswitch();
      });
    });
  };

  //搜索
  const handleSearch = (page, val) => {
    getData(page, val);
  };

  return {
    tableData,
    totalCount,
    loading,
    formRef,
    selectedId,
    formDrawerRef,
    form,
    currentPage,
    limit,
    handleDelete,
    handleEdit,
    addBtn,
    getData,
    handleSubmit,
    handleSearch,
  };
}

//分页
export function usePage(option = {}) {}
