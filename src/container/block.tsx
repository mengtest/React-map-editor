/**
 * 图块组件
 * 图块组件就是网格基本单元
 */

import * as React from 'react'
import { connect } from 'react-redux'
import '@/style/block.less'
import { Icon, Popconfirm, Modal, Form, InputNumber, Input } from 'antd/lib'
import * as Actions from '@/redux/actions/block'
import { blockItem } from '@/types/block'
import { layer } from '@/types/layer'
import * as LayerActions from '@/redux/actions/layer'
import { Map } from 'immutable'
interface Props {
  blockList: Array<blockItem>
  delBlock: (payload: { id: number }) => void
  createBlock: (payload: blockItem) => void
  setCurBlock: (payload: blockItem | undefined) => void
  editBlock: (payload: { width: number; height: number; id: number,extra: Array<any>}) => void
  switchErser: () => void;
  curBlock: blockItem;
  layer: layer
}
class BLockCom extends React.Component<Props, {}> {
  public blockList: Array<blockItem> = []
  public state = {
    visible: false,
    nowBlock: -1,
    showNature: false,
    width: 0,
    height: 0,
    extra: []
  }
  constructor(props: Props) {
    super(props)
  }
  public render() {
    return (
      <div className={this.props.layer.name ? 'block show': 'hidden'}>
        <h3>图块</h3>
        <li className="tools">
          <a href="javascript:;">
            <label htmlFor="imgUpFile">
              <Icon type="plus" />
            </label>
            <input
              type="file"
              className="file"
              multiple={true}
              id="imgUpFile"
              onChange={ev => this.changeImg(ev)}
            />
          </a>
          <a href="javascript:;">
            <Icon
              type="edit"
              onClick={() => {
                this.showConfirm()
              }}
            />
          </a>
          <Popconfirm
            title="Are you sure delete this task?"
            visible={this.state.visible}
            onVisibleChange={ev => {
              this.handleVisibleChange(ev)
            }}
            onConfirm={() => this.delBlock()}
            placement="bottom"
          >
            <a href="javascript:;">
              <Icon type="delete" />
            </a>
          </Popconfirm>
        </li>
        <div className="block__content">{this.renderImg()}</div>
        {this.renderNatureModel()}
      </div>
    )
  }
  public renderImg() {
    const id =
      this.props.curBlock && this.props.curBlock.id
        ? this.props.curBlock.id
        : -1
    return this.props.blockList.map(block => {
      return (
        <img
          src={block.src}
          key={block.id}
          onClick={ev => this.switchBlock(block.id)}
          style={{
            width: block.width,
            height: block.height,
            border: block.id === id ? '1px solid red' : ''
          }}
        />
      )
    })
  }

  public showConfirm() {
    if (!this.props.curBlock) {
      return
    }
    this.setState({
      showNature: true,
      width: this.props.curBlock.width,
      height: this.props.curBlock.height,
      extra: this.props.curBlock.extra
    })
  }
  public renderNatureModel() {
    return (
      <Modal
        title="图块属性"
        visible={this.state.showNature}
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form layout="inline">
          <Form.Item label="图块宽度">
            <InputNumber
              value={this.state.width}
              onChange={ev => {
                this.changeWidth(ev as number)
              }}
            />
          </Form.Item>
          <Form.Item label="图块高度">
            <InputNumber
              value={this.state.height}
              onChange={ev => {
                this.changeHeight(ev as number)
              }}
            />
          </Form.Item>
        </Form>
        <Form layout="inline">
          <Form.Item label="额外属性">
            <a href="javascript:;">
              <Icon
                type="plus-circle"
                onClick={() => {
                  this.addExtra()
                }}
              />
            </a>
          </Form.Item>
        </Form>
        {this.extraRender()}
      </Modal>
    )
  }
  public addExtra() {
    this.setState({
      extra: [...this.state.extra, {}]
    })
  }
  public removeExtra(obj: any) {
    const extra: any = [...this.state.extra]
    const index = this.state.extra.findIndex(ev => {
      return ev === obj
    })
    extra.splice(index, 1)
    this.setState(() => ({
      extra
    }))
  }
  public changeKey(item: any, event: any) {
    const extra: any = [...this.state.extra]
    const index = this.state.extra.findIndex(ev => {
      return ev === item
    })
    const key = Object.keys(item)[0] ? Object.keys(item)[0] : ''
    const obj = {}
    obj[event.target.value] = item[key]
    extra.splice(index, 1, obj)
    event.persist()
    this.setState(() => ({
      extra
    }))
  }
  public changeVal(item: any, event: any) {
    const extra: any = [...this.state.extra]
    const index = this.state.extra.findIndex(ev => {
      return ev === item
    })
    const key = Object.keys(item)[0] ? Object.keys(item)[0] : ''
    const obj = {}
    obj[key] = event.target.value
    extra.splice(index, 1, obj)
    event.persist()
    console.log(extra)
    this.setState(() => ({
      extra
    }))
  }
  public extraRender() {
    // {type: 2}
    return this.state.extra.map((item: any, index) => {
      const key = Object.keys(item)[0] ? Object.keys(item)[0] : ''
      const value = item[key] ? item[key] : ''
      return (
        <Form layout="inline" key={index}>
          <Form.Item label="">
            <Input
              style={{ width: '100px' }}
              placeholder="key"
              value={key}
              onChange={ev => {
                this.changeKey(item, ev)
              }}
            />{' '}
            :
          </Form.Item>
          <Form.Item label="">
            <Input
              style={{ width: '100px' }}
              placeholder="value"
              value={value}
              onChange={ev => {
                this.changeVal(item, ev)
              }}
            />
          </Form.Item>
          <Form.Item label="">
            <a href="javascript:;">
              <Icon
                type="minus-circle"
                onClick={() => this.removeExtra(item)}
              />
            </a>
          </Form.Item>
        </Form>
      )
    })
  }
  public changeWidth(ev: number) {
    this.setState({
      width: ev
    })
  }
  public changeHeight(ev: number) {
    this.setState({
      height: ev
    })
  }
  public handleOk() {
    this.setState({
      showNature: false
    })
    this.props.editBlock({
      width: this.state.width,
      height: this.state.height,
      id: this.props.curBlock.id,
      extra: this.state.extra
    })
    setTimeout(() => {
      this.switchBlock(this.props.curBlock.id)
    })
  }
  public handleCancel() {
    this.setState({
      showNature: false
    })
  }
  public switchBlock(id: number) {
    this.setState({
      nowBlock: id
    })
    console.log(this.props.blockList)
    const curBlock = this.props.blockList.find(block => {
      return block.id === id
    })
    console.log('设置当前图块')
    console.log(curBlock)
    this.props.setCurBlock(curBlock)
    console.log('橡皮擦状态')
    console.log(this.props.layer.eraser)
    // 当前是橡皮擦，切换
    if(this.props.layer.eraser) {
      this.props.switchErser()
    }
  }
  public handleVisibleChange(visible: boolean) {
    if (this.state.nowBlock <= 0) {
      this.setState({ visible: false })
      return
    }
    this.setState({ visible })
  }
  public delBlock() {
    const delId = this.props.blockList.findIndex(block => {
      return block.id === this.state.nowBlock
    })
    this.props.delBlock({
      id: delId
    })
    this.setState({
      nowBlock: -1
    })
  }
  public changeImg(ev: any) {
    const dom = document.getElementById('imgUpFile') as HTMLInputElement
    const files = dom.files as FileList
    if (!files || !files.length) {
      return
    }
    Array.from(files).map(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadstart = function() {
        console.log('文件上传处理......')
      }
      //操作完成
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          this.props.createBlock({
            src: reader.result as string,
            width: image.width,
            height: image.height,
            name: file.name,
            id: Math.random(),
            extra: []
          })
        }
      }
    })
  }
}

export function mapStateToProps(StoreState: Map<string, any>) {
  const block = StoreState.get('block').toJS().blockList
  const layer = StoreState.get('layer').present as layer
  return {
    blockList: block,
    curBlock: layer.curBlock,
    layer
  }
}
function mapDispatchToProps(dispatch: any) {
  return {
    delBlock: (payload: { id: number }) => dispatch(Actions.DelBlock(payload)),
    createBlock: (payload: blockItem) => dispatch(Actions.createBlock(payload)),
    setCurBlock: (payload: blockItem) =>
      dispatch(LayerActions.setCurBlock(payload)),
    editBlock: (payload: { width: number; height: number; id: number,extra:Array<any> }) =>
      dispatch(Actions.editBlock(payload)),
    switchErser: () => dispatch(LayerActions.switchErser())
  }
}
// 合并方法和属性到 Props 上
function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(BLockCom)
