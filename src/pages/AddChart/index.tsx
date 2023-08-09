import { genChartByAiUsingPOST } from '@/services/yubi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(values);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              name="addChart"
              labelAlign="left"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: false, message: '请输入分析目标' }]}
              >
                <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况" />
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入图表名称" />
              </Form.Item>
              <Form.Item name="chartType" label="图表类型">
                <Select
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '饼状图', label: '饼状图' },
                    { value: '雷达图', label: '雷达图' },
                    { value: '散点图', label: '散点图' },
                    { value: '面积堆积图', label: '面积堆积图' },
                    { value: '条形堆积图', label: '条形堆积图' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting} />
          </Card>
          <Divider />
          <Card title="可视化图表">
            {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;

// 异步展示图表页面
// // @ts-ignore
// import {listMyChartByPageUsingPOST} from '@/services/yubi/chartController';
// import {useModel} from '@@/exports';
// import {Avatar, Card, List, message, Result} from 'antd';
// import ReactECharts from 'echarts-for-react';
// import React, {useEffect, useState} from 'react';
// import Search from "antd/es/input/Search";
//
// /**
//  * 我的图表页面
//  * @constructor
//  */
// const MyChartPage: React.FC = () => {
//   const initSearchParams = {
//     // 默认第一页
//     current: 1,
//     // 每页展示4条数据
//     pageSize: 4,
//     sortField: 'createTime',
//     sortOrder: 'desc'
//   };
//
//   const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
//   // 从全局状态中获取到当前登录的用户信息
//   const {initialState} = useModel('@@initialState');
//   const {currentUser} = initialState ?? {};
//   const [chartList, setChartList] = useState<API.Chart[]>();
//   const [total, setTotal] = useState<number>(0);
//   // 用来控制页面是否加载
//   const [loading, setLoading] = useState<boolean>(true);
//
//   const loadData = async () => {
//     // 当触发搜索,把loading设置为true
//     setLoading(true);
//     try {
//       const res = await listMyChartByPageUsingPOST(searchParams);
//       if (res.data) {
//         setChartList(res.data.records ?? []);
//         setTotal(res.data.total ?? 0);
//         // 有些图表有标题,有些没有,直接把标题全部去掉
//         if (res.data.records) {
//           // @ts-ignore
//           res.data.records.forEach((data: { genChart: string; }) => {
//             // 要把后端返回的图表字符串改为对象数组,如果后端返回空字符串，就返回'{}'
//             const chartOption = JSON.parse(data.genChart ?? '{}');
//             // 把标题设为undefined
//             chartOption.title = undefined;
//             // 然后把修改后的数据转换为json设置回去
//             data.genChart = JSON.stringify(chartOption);
//           })
//         }
//       } else {
//         message.error('获取我的图表失败');
//       }
//     } catch (e: any) {
//       message.error('获取我的图表失败，' + e.message);
//     }
//     // 搜索结束设置为false
//     setLoading(false);
//   };
//
//   useEffect(() => {
//     loadData();
//   }, [searchParams]);
//
//   // @ts-ignore
//   return (
//     <div className="my-chart-page">
//       {/* 引入搜索框 */}
//       <div>
//         {/*
//           当用户点击搜索按钮触发 一定要把新设置的搜索条件初始化，要把页面切回到第一页;
//           如果用户在第二页,输入了一个新的搜索关键词,应该重新展示第一页,而不是还在搜第二页的内容
//         */}
//         <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={(value) => {
//           // 设置搜索条件
//           setSearchParams({
//             // 原始搜索条件
//             ...initSearchParams,
//             // 搜索词
//             name: value,
//           })
//         }}/>
//       </div>
//       <div className="margin-16"/>
//       <List
//         /*
//           栅格间隔16像素;xs屏幕<576px,栅格数1;
//           sm屏幕≥576px，栅格数1;md屏幕≥768px,栅格数1;
//           lg屏幕≥992px,栅格数2;xl屏幕≥1200px,栅格数2;
//           xxl屏幕≥1600px,栅格数2
//         */
//         grid={{
//           gutter: 16,
//           xs: 1,
//           sm: 1,
//           md: 1,
//           lg: 2,
//           xl: 2,
//           xxl: 2,
//         }}
//         pagination={{
//           /*
//             page第几页，pageSize每页显示多少条;
//            当用户点击这个分页组件,切换分页时,这个组件就会去触发onChange方法,会改变咱们现在这个页面的搜索条件
//               */
//           onChange: (page, pageSize) => {
//             // 当切换分页，在当前搜索条件的基础上，把页数调整为当前的页数
//             setSearchParams({
//               ...searchParams,
//               current: page,
//               pageSize,
//             })
//           },
//           // 显示当前页数
//           current: searchParams.current,
//           // 页面参数改成自己的
//           pageSize: searchParams.pageSize,
//           // 总数设置成自己的
//           total: total,
//         }}
//         loading={loading}
//         dataSource={chartList}
//         renderItem={(item) => (
//           <List.Item key={item.id}>
//             <Card style={{width: '100%'}}>
//               <List.Item.Meta
//                 // 把当前登录用户信息的头像展示出来
//                 avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
//                 title={item.name}
//                 description={item.chartType ? '图表类型：' + item.chartType : undefined}
//               />
//               <>
//                 {
//                   // 当状态（item.status）为'wait'时，显示待生成的结果组件
//                   item.status === 'wait' && <>
//                     <Result
//                       // 状态为警告
//                       status="warning"
//                       title="待生成"
//                       // 子标题显示执行消息，如果执行消息为空，则显示'当前图表生成队列繁忙，请耐心等候'
//                       subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
//                     />
//                   </>
//                 }
//                 {
//                   item.status === 'running' && <>
//                     <Result
//                       // 状态为信息
//                       status="info"
//                       title="图表生成中"
//                       // 子标题显示执行消息
//                       subTitle={item.execMessage}
//                     />
//                   </>
//
//                 }
//                 {
//                   // 当状态（item.status）为'succeed'时，显示生成的图表
//                   item.status === 'succeed' && <>
//                     <div style={{marginBottom: 16}}/>
//                     <p>{'分析目标：' + item.goal}</p>
//                     <div style={{marginBottom: 16}}/>
//                     <ReactECharts option={item.genChart && JSON.parse(item.genChart)}/>
//                   </>
//                 }
//                 {
//                   // 当状态（item.status）为'failed'时，显示生成失败的结果组件
//                   item.status === 'failed' && <>
//                     <Result
//                       status="error"
//                       title="图表生成失败"
//                       subTitle={item.execMessage}
//                     />
//                   </>
//                 }
//               </>
//             </Card>
//           </List.Item>
//         )}
//       />
//     </div>
//   );
// };
// export default MyChartPage;
