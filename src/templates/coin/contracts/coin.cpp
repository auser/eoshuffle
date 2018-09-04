#include <eosiolib/eosio.hpp>
using namespace eosio;

class hello : public eosio::contract {
  private:
    bool ishi=false;

  public:
      using contract::contract;

      /// @abi action
      void hi( account_name user ) {
          ishi=true;
          chkuser(user);
      }

      /// @abi action
      void bye( account_name user ) {
        ishi=false;
        chkuser(user);
      }

      void chkuser(account_name user) {
        if (is_account(user)) {
          if (ishi) {
            print("Hello world", name{user}, "test");
          } else {
            print("Bye world", name{user});
          }
        }
      }
};

EOSIO_ABI( hello, (hi) (bye) )
