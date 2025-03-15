import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){

    const [cart, setCart] = useState({});
    
    const [isScreenLoading, setIsScreenLoading] = useState(false);
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
  
    const onSubmit = handleSubmit((data) => {
      checkout(data);
    });
  
    const getCart = async () => {
        setIsScreenLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
        setCart(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsScreenLoading(false);
      }
    };
  
    const removeCart = async () => {
        setIsScreenLoading(true);
      try {
        const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
  
        if (res.data.success) {
          alert(res.data.message);
          getCart();
        } else {
          alert("移除失敗");
        }
      } catch (error) {
        console.log(error);
        alert("移除失敗");
      } finally {
        setIsScreenLoading(false);
      }
    };
    const removeCartItem = async (id) => {
        setIsScreenLoading(true);
      try {
        const res = await axios.delete(
          `${BASE_URL}/v2/api/${API_PATH}/cart/${id}`
        );
  
        if (res.data.success) {
          alert(res.data.message);
          getCart();
        } else {
          alert("移除失敗");
        }
      } catch (error) {
        console.log(error);
        alert("移除失敗");
      } finally {
        setIsScreenLoading(false);
      }
    };
  
    const updateCartItem = async (cartItem_id,product_id,qty) => {
        setIsScreenLoading(true);
        try{
          await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`,
            {
              data: {
                product_id,
                qty: Number(qty)
              }
            })
          getCart();
        }
        catch(error){
          alert('更新購物車品項失敗')
        }
        finally{
          setIsScreenLoading(false);
        }
      }
  
    useEffect(() => {
      getCart();
    }, []);
    const checkout = async (data) => {
        setIsScreenLoading(true);
      try {
        const { message, ...user } = data;
        const userInfo = {
          data: {
            user,
            message,
          },
        };
        const res = await axios.post(
          `${BASE_URL}/v2/api/${API_PATH}/order`,
          userInfo
        );
        if (res.data.success) {
          alert(res.data.message);
          getCart();
          reset();
        } else {
          alert("付款失敗");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsScreenLoading(false);
      }
    };



    return (
        <>
            {cart.carts?.length > 0 &&(
                <div>
                    <div className="text-end py-3">
                    <button onClick={removeCart} className="btn btn-outline-danger" type="button">
                        清空購物車
                    </button>
                    </div>

                    <table className="table align-middle">
                    <thead>
                        <tr>
                        <th></th>
                        <th>品名</th>
                        <th style={{ width: "150px" }}>數量/單位</th>
                        <th className="text-end">單價</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cart.carts?.map((cartItem)=>(
                        <tr key={cartItem.id}>
                            <td>
                            <button onClick={ () => removeCartItem(cartItem.id)} type="button" className="btn btn-outline-danger btn-sm">
                                x
                            </button>
                            </td>
                            <td>{cartItem.product.title}</td>
                            <td style={{ width: "150px" }}>
                            <div className="d-flex align-items-center">
                                <div className="btn-group me-2" role="group">
                                <button
                                    onClick={()=>updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty-1)}
                                    disabled={cartItem.qty === 1}
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                >
                                    -
                                </button>
                                <span
                                    className="btn border border-dark"
                                    style={{ width: "50px", cursor: "auto" }}
                                >{cartItem.qty}</span>
                                <button
                                onClick={()=>updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty+1)}
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                >
                                    +
                                </button>
                                </div>
                                <span className="input-group-text bg-transparent border-0">
                                {cartItem.product.unit}
                                </span>
                            </div>
                            </td>
                            <td className="text-end">{cartItem.total}</td>
                        </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                        <td colSpan="3" className="text-end">
                            總計：
                        </td>
                        <td className="text-end" style={{ width: "130px" }}>{cart.total}</td>
                        </tr>
                    </tfoot>
                    </table>
                </div>
            )}

            <div className="my-5 row justify-content-center">
            <form onSubmit={onSubmit} className="col-md-6">
                <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    {...register('email', {
                    required: 'email為必填欄位',
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'email格式錯誤'
                    }
                    })}
                    id="email"
                    type="email"
                    className={`form-control ${errors.email && 'is-invalid'}`}
                    placeholder="請輸入 Email"
                />
                
                {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}            
                </div>
    
                <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    收件人姓名
                </label>
                <input
                    {...register('name',{ required:'姓名欄位必填', })}
                    id="name"
                    className={`form-control ${errors.name && 'is-invalid'}`}
                    placeholder="請輸入姓名"
                />
                {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                </div>
    
                <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                    收件人電話
                </label>
                <input
                    {...register('tel',{ required:'電話欄位必填',
                    pattern:{
                        value:/^(0[2-8]\d{7}|09\d{8})$/,
                        message:'電話格式錯誤'
                    }
                    })}
                    id="tel"
                    type="text"
                    className={`form-control ${errors.tel && 'is-invalid'}`}
                    placeholder="請輸入電話"
                />
    
                {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                </div>
    
                <div className="mb-3">
                <label htmlFor="address" className="form-label">
                    收件人地址
                </label>
                <input
                    {...register('address',{ required:'地址欄位必填'  })}
                    id="address"
                    type="text"
                    className={`form-control ${errors.address && 'is-invalid'}`}
                    placeholder="請輸入地址"
                />
    
                {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
                </div>
    
                <div className="mb-3">
                <label htmlFor="message" className="form-label">
                    留言
                </label>
                <textarea
                    {...register('message')}
                    id="message"
                    className="form-control"
                    cols="30"
                    rows="10"
                ></textarea>
                </div>
                <div className="text-end">
                <button type="submit" className="btn btn-danger">
                    送出訂單
                </button>
                </div>
            </form>
            </div>
    
            {isScreenLoading && (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(255,255,255,0.3)",
                zIndex: 999,
                }}
            >
                <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
            </div>
            )}
        </>
    )
}